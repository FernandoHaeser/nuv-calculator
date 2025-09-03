package br.com.calculadoranuv.calcnuv_api;

import java.util.List;

public class EstimadoRequest {

    private List<Long> licencas;
    private List<Long> quantidades;

    /**
     * Construtor padrão (vazio).
     * ESSENCIAL para que o framework consiga criar o objeto a partir do JSON.
     */
    public EstimadoRequest() {
    }

    // Getters e Setters
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
     * Método toString (útil para o nosso debug no passo 3).
     */
    @Override
    public String toString() {
        return "EstimadoRequest{" +
                "licencas=" + licencas +
                ", quantidades=" + quantidades +
                '}';
    }
}