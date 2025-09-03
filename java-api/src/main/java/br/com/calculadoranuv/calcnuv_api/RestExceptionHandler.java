package br.com.calculadoranuv.calcnuv_api;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Collections;
import java.util.Map;

// Esta anotação transforma a classe em um "gerente de exceções" global para a API
@RestControllerAdvice
public class RestExceptionHandler {

    // Este método será acionado sempre que a API não conseguir ler/converter o JSON da requisição
    // (que é o que acontece quando o número é grande demais para o tipo Long)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // Define o status HTTP para 400 Bad Request
    public Map<String, String> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {

        // Log do erro no console do servidor para depuração
        System.err.println("Erro de parsing do JSON: " + ex.getMessage());

        // Retorna um JSON amigável para o front-end
        return Collections.singletonMap("error", "O valor inserido é inválido ou grande demais. Por favor, verifique os números.");
    }
}