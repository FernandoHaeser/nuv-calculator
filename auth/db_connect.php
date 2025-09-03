<?php
// --- CONFIGURAÇÃO DO BANCO DE DADOS ---
$servername = "localhost"; // Geralmente é localhost
$username = "fernandohaeser"; // O usuário que você usa para acessar o MariaDB
$password = "Yourboos0202_"; // A senha deste usuário
$dbname = "nuv_calculator_db"; // O nome do banco que criamos no Passo 1

// Cria a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica se a conexão falhou
if ($conn->connect_error) {
  // Em um ambiente de produção, seria melhor registrar esse erro em um arquivo de log
  // em vez de mostrá-lo na tela.
  die("Falha na conexão com o banco de dados: " . $conn->connect_error);
}
?>