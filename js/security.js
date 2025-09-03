// ==========================================
// PROTEÇÕES AVANÇADAS CONTRA INSPEÇÃO
// ==========================================

// Bloqueia o menu de contexto (clique direito)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showError('A inspeção desta página não é permitida.');
    return false;
});

// Bloqueia o uso de teclas de desenvolvedor
document.onkeydown = function(e) {
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')) {
        showError('A inspeção desta página não é permitida.');
        return false;
    }
};

// Bloqueia a abertura do console
setInterval(function() {
    if (window.console && console.log) {
        console.log = function() {};
        console.warn = function() {};
        console.error = function() {};
        console.info = function() {};
    }
}, 1000);

// Função auxiliar para exibir o erro (pode ser adaptada para cada página)
function showError(message) {
    // Implementação para mostrar um alerta ou uma mensagem na tela.
    alert(message);
}