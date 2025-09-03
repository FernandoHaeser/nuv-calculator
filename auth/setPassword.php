<?php
/**
 * Endpoint para salvar a primeira senha de um usuário LDAP.
 * @author CGR & Gemini
 */
session_start();
require_once 'db_connect.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Verifica se o usuário passou pelo processo de login para chegar aqui
if (!isset($_SESSION['set_password_user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Acesso não autorizado. Por favor, comece pelo login.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$senha = $data['senha'] ?? '';

if (empty($senha)) {
    echo json_encode(['status' => 'error', 'message' => 'A senha não pode estar em branco.']);
    exit;
}

$user_id = $_SESSION['set_password_user_id'];
$senha_hash = password_hash($senha, PASSWORD_BCRYPT);

// Atualiza o usuário no banco de dados com a nova senha
$stmt = $conn->prepare("UPDATE usuarios SET senha = ? WHERE id = ?");
$stmt->bind_param("si", $senha_hash, $user_id);

if ($stmt->execute()) {
    // Limpa as variáveis de sessão temporárias para finalizar o processo
    unset($_SESSION['set_password_user_id']);
    unset($_SESSION['set_password_username']);
    echo json_encode(['status' => 'success', 'message' => 'Senha definida com sucesso!']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao salvar a senha.']);
}

$stmt->close();
$conn->close();
?>