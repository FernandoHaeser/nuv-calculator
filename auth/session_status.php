<?php
/**
 * Endpoint de API para verificar o status da sessão do usuário.
 * Retorna um JSON com 'loggedIn' (true/false) e 'username'.
 * Agora também identifica usuários no processo de definir a primeira senha.
 * @author CGR & Gemini
 */

session_start();
header('Content-Type: application/json');

// Caso 1: Usuário está totalmente logado.
if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
    echo json_encode([
        'loggedIn' => true,
        'username' => $_SESSION['username']
    ]);
} 
// Caso 2: Usuário está no processo de definir a primeira senha.
else if (isset($_SESSION['set_password_user_id']) && isset($_SESSION['set_password_username'])) {
    echo json_encode([
        'loggedIn' => false, // Ainda não está logado de fato.
        'username' => $_SESSION['set_password_username'] // Mas já sabemos quem ele é.
    ]);
} 
// Caso 3: Ninguém logado e nenhum processo em andamento.
else {
    echo json_encode(['loggedIn' => false]);
}
?>