package br.com.calculadoranuv.calcnuv_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CalcnuvApiApplication {

     // <<< ADICIONAR ESTA LINHA
	public static void main(String[] args) {
		SpringApplication.run(CalcnuvApiApplication.class, args);
	}



}
