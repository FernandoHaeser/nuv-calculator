<?php
session_start();

$timeout = 2600; // Tempo em segundos para o logout (30 minutos * 60 segundos)

// --- INÍCIO DA LÓGICA DE LOGOUT POR INATIVIDADE ---

// Verifica se o usuário está logado
if (isset($_SESSION['user_id'])) {
    
    // Verifica se o carimbo de tempo da última atividade existe
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $timeout)) {
        
        // Se o tempo de inatividade foi excedido, destrói a sessão
        session_unset();
        session_destroy();
        
        // Redireciona para a página de login com uma mensagem
        header('Location: /html/login.html?reason=session_expired');
        exit;
    }
    
    // Se o usuário está ativo, atualiza o carimbo de tempo
    $_SESSION['last_activity'] = time();
}
// --- FIM DA LÓGICA DE LOGOUT POR INATIVIDADE ---


// Verificação padrão: se o usuário não está logado, redireciona
if (!isset($_SESSION['user_id'])) {
    header('Location: /login.html'); 
    exit;
}
?>