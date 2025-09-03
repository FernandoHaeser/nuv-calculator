<?php
/**
 * Função centralizada para registrar atividades dos usuários no banco de dados.
 * @author CGR & Gemini
 * @param mysqli $conn O objeto de conexão com o banco de dados.
 * @param int|null $user_id O ID do usuário que realiza a ação.
 * @param string $username O nome do usuário.
 * @param string $action A ação que está sendo registrada.
 * @param array|null $details Detalhes adicionais a serem salvos em JSON.
 */
function log_activity($conn, $user_id, $username, $action, $details = null) {
    // A linha "require 'db_connect.php';" foi REMOVIDA daqui.
    
    $details_json = ($details !== null) ? json_encode($details) : null;
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';

    $stmt = $conn->prepare(
        "INSERT INTO logs_atividades (user_id, usuario_nome, acao, detalhes, ip_address) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("issss", $user_id, $username, $action, $details_json, $ip_address);
    $stmt->execute();
    $stmt->close();
}
?>