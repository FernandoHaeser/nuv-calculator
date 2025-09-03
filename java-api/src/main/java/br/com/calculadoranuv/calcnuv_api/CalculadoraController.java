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
    private static final double CONSUMO_POR_DIA_BASE = TAXA_MB_POR_MINUTO * MINUTOS_POR_DIA;

    // Mapa para o sistema assíncrono
    public static final Map<String, Object> resultadosCalculos = new ConcurrentHashMap<>();

    private final CalculoService calculoService;

    // Classe interna para armazenar os resultados da combinação
    private static class CombinacaoResultado {
        private final List<Integer> quantidades;
        private final double mbTotal;

        public CombinacaoResultado(List<Integer> quantidades, double mbTotal) {
            this.quantidades = quantidades;
            this.mbTotal = mbTotal;
        }

        public double getMbTotal() {
            return mbTotal;
        }
    }

    @Autowired
    public CalculadoraController(CalculoService calculoService) {
        this.calculoService = calculoService;
    }

    // --- Cálculo Estimado ---
    @PostMapping("/estimado")
    public Map<String, Object> calcularEstimado(@RequestBody EstimadoRequest request) {
        System.out.println("Dados recebidos para estimado: " + request);

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

    // --- ENDPOINTS PARA COMBINAÇÕES ---

    // Agora inicia em /api/combinacoes (antes estava /combinacoes/iniciar)
    @PostMapping("/combinacoes")
    public ResponseEntity<Map<String, String>> iniciarCalculoCombinacoes(@RequestBody CombinacoesRequest request) {
        String jobId = UUID.randomUUID().toString();
        resultadosCalculos.put(jobId, "PROCESSANDO");
        calculoService.processarCombinacoes(jobId, request, this);
        return ResponseEntity.accepted().body(Collections.singletonMap("jobId", jobId));
    }

    @GetMapping("/combinacoes/resultado/{jobId}")
    public ResponseEntity<Object> getResultadoCombinacoes(@PathVariable String jobId) {
        Object resultado = resultadosCalculos.get(jobId);
        if (resultado == null) return ResponseEntity.notFound().build();
        if ("PROCESSANDO".equals(resultado)) {
            return ResponseEntity.ok(Collections.singletonMap("status", "PROCESSANDO"));
        } else {
            resultadosCalculos.remove(jobId);
            return ResponseEntity.ok(resultado);
        }
    }

    public List<Map<String, Object>> executarLogicaCombinacoes(CombinacoesRequest request) {
        double totalStorageMb = request.getTb() * (1024.0 * 1024.0);

        Map<Long, Long> groupedItens = request.getItens().stream()
                .collect(Collectors.groupingBy(ItemCombinacao::getDias, Collectors.summingLong(ItemCombinacao::getQtd)));

        List<Long> uniqueLicencas = new ArrayList<>(groupedItens.keySet());
        Collections.sort(uniqueLicencas);

        final int maxCombinacoesAVerificar = uniqueLicencas.contains(1L) ? 500_000 : 5_000_000;

        Map<Long, Double> consumoPorLicenca = uniqueLicencas.stream()
                .collect(Collectors.toMap(dias -> dias, dias -> CONSUMO_POR_DIA_BASE * dias));

        Map<Long, Integer> limites = uniqueLicencas.stream()
                .collect(Collectors.toMap(dias -> dias,
                        dias -> (int) Math.floor(totalStorageMb / consumoPorLicenca.get(dias))));

        List<CombinacaoResultado> melhoresResultados = new ArrayList<>();
        gerarMelhoresCombinacoes(0, new int[uniqueLicencas.size()], uniqueLicencas, consumoPorLicenca,
                totalStorageMb, limites, melhoresResultados, new long[]{0}, maxCombinacoesAVerificar);

        return melhoresResultados.stream().map(res -> {
            Map<String, Object> map = new HashMap<>();
            map.put("quant", res.quantidades);
            map.put("mb", res.mbTotal);
            return map;
        }).collect(Collectors.toList());
    }

    private void gerarMelhoresCombinacoes(int index,
                                          int[] currentQuantidades,
                                          List<Long> uniqueLicencas,
                                          Map<Long, Double> consumoPorLicenca,
                                          double totalStorageMb,
                                          Map<Long, Integer> limites,
                                          List<CombinacaoResultado> melhoresResultados,
                                          long[] counter,
                                          final int maxCombinacoes) {

        if (counter[0]++ > maxCombinacoes) return;

        if (index == uniqueLicencas.size()) {
            double totalMb = 0;
            for (int i = 0; i < uniqueLicencas.size(); i++) {
                totalMb += consumoPorLicenca.get(uniqueLicencas.get(i)) * currentQuantidades[i];
            }
            if (totalMb > 0 && totalMb <= totalStorageMb) {
                List<Integer> qList = Arrays.stream(currentQuantidades).boxed().collect(Collectors.toList());

                if (melhoresResultados.size() < 10) {
                    melhoresResultados.add(new CombinacaoResultado(qList, totalMb));
                    melhoresResultados.sort(Comparator.comparingDouble(CombinacaoResultado::getMbTotal).reversed());
                } else {
                    double piorResultadoAtual = melhoresResultados.get(9).getMbTotal();
                    if (totalMb > piorResultadoAtual) {
                        melhoresResultados.remove(9);
                        melhoresResultados.add(new CombinacaoResultado(qList, totalMb));
                        melhoresResultados.sort(Comparator.comparingDouble(CombinacaoResultado::getMbTotal).reversed());
                    }
                }
            }
            return;
        }

        long dias = uniqueLicencas.get(index);
        int limite = limites.get(dias);
        for (int i = 0; i <= limite; i++) {
            currentQuantidades[index] = i;
            gerarMelhoresCombinacoes(index + 1, currentQuantidades, uniqueLicencas,
                    consumoPorLicenca, totalStorageMb, limites, melhoresResultados, counter, maxCombinacoes);
        }
    }
}
