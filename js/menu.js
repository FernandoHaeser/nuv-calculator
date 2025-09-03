/**
 * @file Script para adicionar efeitos visuais e de acessibilidade aos botões do menu principal.
 * @description Este código seleciona todos os elementos com a classe '.menu-btn' e aplica
 * a eles uma série de eventos de mouse e foco para melhorar a interatividade.
 * @author CGR & Gemini
 */

// Seleciona todos os elementos que têm a classe 'menu-btn' e itera sobre cada um.
document.querySelectorAll('.menu-btn').forEach(btn => {
  
  // Evento disparado quando o botão do mouse é pressionado sobre o elemento.
  // Cria um efeito de "pressionar", diminuindo o tamanho do botão e adicionando uma sombra.
  btn.addEventListener('mousedown', () => {
    btn.style.transform = 'scale(0.97)';
    btn.style.boxShadow = '0 2px 12px #a18aff88';
  });

  // Evento disparado quando o botão do mouse é solto.
  // Remove os estilos de 'mousedown' para retornar o botão ao estado normal.
  btn.addEventListener('mouseup', () => {
    btn.style.transform = '';
    btn.style.boxShadow = '';
  });

  // Evento disparado quando o cursor do mouse sai da área do botão.
  // Também remove os estilos para garantir que o botão não fique "pressionado" se o mouse for arrastado para fora.
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.boxShadow = '';
  });

  // Evento para acessibilidade: disparado quando o botão ganha foco (ex: via tecla Tab).
  // Adiciona a classe 'focus' para que um estilo visual de foco possa ser aplicado via CSS.
  btn.addEventListener('focus', () => {
    btn.classList.add('focus');
  });

  // Evento para acessibilidade: disparado quando o botão perde o foco.
  // Remove a classe 'focus' para retornar ao estado visual padrão.
  btn.addEventListener('blur', () => {
    btn.classList.remove('focus');
  });
});