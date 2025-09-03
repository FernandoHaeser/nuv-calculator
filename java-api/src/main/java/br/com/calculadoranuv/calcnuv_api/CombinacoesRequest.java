package br.com.calculadoranuv.calcnuv_api;

import java.util.List;

public class CombinacoesRequest {
    private double tb;
    private List<ItemCombinacao> itens; // MUDOU DE 'List<Long> licencas' PARA ISTO

    // Getters e Setters
    public double getTb() { return tb; }
    public void setTb(double tb) { this.tb = tb; }
    public List<ItemCombinacao> getItens() { return itens; } // MUDOU AQUI
    public void setItens(List<ItemCombinacao> itens) { this.itens = itens; } // MUDOU AQUI
}
