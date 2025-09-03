package br.com.calculadoranuv.calcnuv_api;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class CalculoService {

    @Async
    public void processarCombinacoes(String jobId, CombinacoesRequest request, CalculadoraController controller) {
        // 1. Executa a lógica de cálculo pesada que estava no controller
        List<Map<String, Object>> resultado = controller.executarLogicaCombinacoes(request);

        // 2. Ao terminar, armazena o resultado final no mapa estático do controller
        CalculadoraController.resultadosCalculos.put(jobId, resultado);
    }
}
