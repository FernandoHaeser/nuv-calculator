<?php
session_start();
require_once 'db_connect.php'; // <<< ADICIONADO para ter o $conn
require_once 'logger.php';

if (!isset($_SESSION['user_id'])) {
    header('HTTP/1.1 403 Forbidden');
    exit('Acesso Negado');
}

$data = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['user_id'];
$username = $_SESSION['username'];
$action = $data['action'] ?? 'CALCULO_DESCONHECIDO';
$details = $data['details'] ?? null;

// Passa o $conn para a função
log_activity($conn, $user_id, $username, $action, $details);

$conn->close();

header('Content-Type: application/json');
echo json_encode(['status' => 'logged']);
?>