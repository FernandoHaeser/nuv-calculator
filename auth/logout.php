<?php
session_start();
require_once 'db_connect.php'; // <<< ADICIONADO para ter o $conn
require_once 'logger.php';

$user_id = $_SESSION['user_id'] ?? null;
$username = $_SESSION['username'] ?? 'unknown';

if ($user_id) {
    // Passa o $conn para a função
    log_activity($conn, $user_id, $username, 'LOGOUT');
}

session_unset();
session_destroy();

// Fecha a conexão com o banco antes de redirecionar
$conn->close();

header('Location: /html/login.html'); 
exit;
?>