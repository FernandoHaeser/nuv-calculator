package br.com.calculadoranuv.calcnuv_api;

import java.util.List;

public class EstimadoRequest {

    private List<Long> licencas;
    private List<Long> quantidades;

    /**
     * Construtor padrão (vazio).
     * ESSENCIAL para que o Spring Boot (via Jackson) consiga criar o objeto a partir do JSON.
     */
    public EstimadoRequest() {
    }

    // Getters e Setters (os seus já estavam corretos)
    public List<Long> getLicencas() {
        return licencas;
    }

    public void setLicencas(List<Long> licencas) {
        this.licencas = licencas;
    }

    public List<Long> getQuantidades() {
        return quantidades;
    }

    public void setQuantidades(List<Long> quantidades) {
        this.quantidades = quantidades;
    }

    /**
     * Método toString (opcional, mas muito útil para depuração).
     * Permite que System.out.println(request) mostre os dados de forma legível.
     */
    @Override
    public String toString() {
        return "EstimadoRequest{" +
                "licencas=" + licencas +
                ", quantidades=" + quantidades +
                '}';
    }
}