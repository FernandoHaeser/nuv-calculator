package br.com.calculadoranuv.calcnuv_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CalculadoraController {

    // Constantes
    private static final double TAXA_MB_POR_MINUTO = 21.35;
    private static final int MINUTOS_POR_DIA = 60 * 24;
    private static final double MB_EM_TB = 1024.0 * 1024.0;
    private static final double CONSUMO_POR_DIA_BASE = TAXA_MB_POR_MINUTO * MINUTOS_POR_DIA;
    private static final int MAX_COMBINACOES_A_VERIFICAR = 1_000_000;

    // Mapa para o sistema assíncrono
    public static final Map<String, Object> resultadosCalculos = new ConcurrentHashMap<>();

    @Autowired
    private CalculoService calculoService;

    /**
     * Endpoint para o cálculo estimado.
     */
    @PostMapping("/estimado")
    public Map<String, Object> calcularEstimado(@RequestBody EstimadoRequest request) {
        double totalMb = 0;
        List<Long> licencas = request.getLicencas();
        List<Long> quantidades = request.getQuantidades();
        if (licencas != null && quantidades != null && licencas.size() == quantidades.size()) {
            for (int i = 0; i < licencas.size(); i++) {
                totalMb += CONSUMO_POR_DIA_BASE * licencas.get(i) * quantidades.get(i);
            }
        }
        return Collections.singletonMap("resultadoMb", totalMb);
    }

    // --- ENDPOINTS ASSÍNCRONOS PARA COMBINAÇÕES ---

    @PostMapping("/combinacoes/iniciar")
    public ResponseEntity<Map<String, String>> iniciarCalculoCombinacoes(@RequestBody CombinacoesRequest request) {
        String jobId = UUID.randomUUID().toString();
        resultadosCalculos.put(jobId, "PROCESSANDO");
        calculoService.processarCombinacoes(jobId, request, this);
        return ResponseEntity.accepted().body(Collections.singletonMap("jobId", jobId));
    }

    @GetMapping("/combinacoes/resultado/{jobId}")
    public ResponseEntity<Object> getResultadoCombinacoes(@PathVariable String jobId) {
        Object resultado = resultadosCalculos.get(jobId);
        if (resultado == null) {
            return ResponseEntity.notFound().build();
        }
        if ("PROCESSANDO".equals(resultado)) {
            return ResponseEntity.ok(Collections.singletonMap("status", "PROCESSANDO"));
        } else {
            resultadosCalculos.remove(jobId);
            return ResponseEntity.ok(resultado);
        }
    }

    // Lógica de cálculo pesada
    public List<Map<String, Object>> executarLogicaCombinacoes(CombinacoesRequest request) {
        double totalStorageMb = request.getTb() * MB_EM_TB;
        Map<Long, Long> groupedItens = request.getItens().stream()
                .collect(Collectors.groupingBy(ItemCombinacao::getDias, Collectors.summingLong(ItemCombinacao::getQtd)));
        List<Long> uniqueLicencas = new ArrayList<>(groupedItens.keySet());
        Collections.sort(uniqueLicencas);
        Map<Long, Double> consumoPorLicenca = uniqueLicencas.stream()
                .collect(Collectors.toMap(dias -> dias, dias -> CONSUMO_POR_DIA_BASE * dias));
        Map<Long, Integer> limites = uniqueLicencas.stream()
                .collect(Collectors.toMap(dias -> dias, dias -> (int) Math.floor(totalStorageMb / consumoPorLicenca.get(dias))));
        List<Map<String, Object>> melhoresResultados = new ArrayList<>();
        gerarMelhoresCombinacoes(0, new int[uniqueLicencas.size()], uniqueLicencas, consumoPorLicenca, totalStorageMb, limites, melhoresResultados, new long[]{0});
        return melhoresResultados;
    }

    // Função recursiva com a correção do bug
    private void gerarMelhoresCombinacoes(int index, int[] currentQuantidades, List<Long> uniqueLicencas, Map<Long, Double> consumoPorLicenca, double totalStorageMb, Map<Long, Integer> limites, List<Map<String, Object>> melhoresResultados, long[] counter) {
        if (counter[0]++ > MAX_COMBINACOES_A_VERIFICAR) {
            return;
        }
        if (index == uniqueLicencas.size()) {
            double totalMb = 0;
            for (int i = 0; i < uniqueLicencas.size(); i++) {
                totalMb += consumoPorLicenca.get(uniqueLicencas.get(i)) * currentQuantidades[i];
            }

            // ### INÍCIO DA CORREÇÃO ###
            // A condição agora é simples: o total de MB tem que ser maior que zero
            // e menor ou igual ao espaço total. Isso previne o erro com combinações vazias.
            if (totalMb > 0 && totalMb <= totalStorageMb) {
                // ### FIM DA CORREÇÃO ###
                if (melhoresResultados.size() < 10) {
                    Map<String, Object> combinacao = new HashMap<>();
                    combinacao.put("quant", Arrays.stream(currentQuantidades).boxed().collect(Collectors.toList()));
                    combinacao.put("mb", totalMb);
                    melhoresResultados.add(combinacao);
                    melhoresResultados.sort(Comparator.comparingDouble(o -> (double) o.get("mb")).reversed());
                } else {
                    double piorResultadoAtual = (double) melhoresResultados.get(9).get("mb");
                    if (totalMb > piorResultadoAtual) {
                        melhoresResultados.remove(9);
                        Map<String, Object> combinacao = new HashMap<>();
                        combinacao.put("quant", Arrays.stream(currentQuantidades).boxed().collect(Collectors.toList()));
                        combinacao.put("mb", totalMb);
                        melhoresResultados.add(combinacao);
                        melhoresResultados.sort(Comparator.comparingDouble(o -> (double) o.get("mb")).reversed());
                    }
                }
            }
            return;
        }
        long dias = uniqueLicencas.get(index);
        int limite = limites.get(dias);
        for (int i = 0; i <= limite; i++) {
            currentQuantidades[index] = i;
            gerarMelhoresCombinacoes(index + 1, currentQuantidades, uniqueLicencas, consumoPorLicenca, totalStorageMb, limites, melhoresResultados, counter);
        }
    }
}