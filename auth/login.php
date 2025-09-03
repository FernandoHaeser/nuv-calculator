<?php
session_start();
require_once 'db_connect.php';
require_once 'logger.php'; // <<< LINHA ADICIONADA

header('Content-Type: application/json');
// ... (seus headers de CORS aqui) ...

$data = json_decode(file_get_contents('php://input'), true);
$usuario = $data['usuario'] ?? '';
$senha = $data['senha'] ?? '';

if (empty($usuario)) {
    echo json_encode(['status' => 'error', 'message' => 'Usuário é obrigatório.']);
    exit;
}

$stmt = $conn->prepare("SELECT id, senha FROM usuarios WHERE usuario = ? AND is_ldap = TRUE");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Usuário LDAP inválido ou não autorizado.']);
    $stmt->close();
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();

if (empty($senha)) {
    if (empty($user['senha'])) {
        $_SESSION['set_password_user_id'] = $user['id'];
        $_SESSION['set_password_username'] = $usuario;
        echo json_encode(['status' => 'set_password', 'message' => 'Redirecionando para criar senha.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Senha é obrigatória.']);
    }
} else {
    if (empty($user['senha'])) {
        echo json_encode(['status' => 'error', 'message' => 'Usuário precisa criar a primeira senha. Deixe o campo senha em branco.']);
    } elseif (password_verify($senha, $user['senha'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $usuario;
        $_SESSION['last_activity'] = time();
        
        // <<< LOG DE SUCESSO ADICIONADO >>>
        log_activity($conn, $user['id'], $usuario, 'LOGIN_SUCCESS');
        
        echo json_encode(['status' => 'success', 'message' => 'Login bem-sucedido!']);
    } else {
        // <<< LOG DE FALHA ADICIONADO >>>
        // Usamos $user['id'] e $usuario pois sabemos quem tentou logar, apesar da senha errada.
        log_activity($conn, $user['id'], $usuario, 'LOGIN_FAILURE');
        
        echo json_encode(['status' => 'error', 'message' => 'Usuário ou senha inválidos.']);
    }
}

$stmt->close();
$conn->close();
?>