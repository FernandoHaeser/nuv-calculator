<?php
/**
 * Página principal e menu de navegação da aplicação NUV-Calculator.
 */
session_start();

// 'Gatekeeper': Se a variável de sessão 'user_id' não existir, o usuário não está logado.
if (!isset($_SESSION['user_id'])) {
    // Redireciona o navegador para a página de login.
    header('Location: /html/login.html');
    // Interrompe a execução do script para garantir que o HTML abaixo não seja renderizado.
    exit;
}

// Obtém o nome do usuário da sessão, se estiver disponível.
$username = isset($_SESSION['user_name']) ? htmlspecialchars($_SESSION['user_name']) : 'Usuário';

?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu de Aplicações</title>
    <link rel="stylesheet" href="/css/optionMenu.css">
    <script src="/js/security.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<body>
    <header class="user-header">
        <div class="user-menu">
            <div id="user-display" class="user-display">
                <span id="username-placeholder"><?php echo $username; ?></span>
                <span class="arrow-down">▼</span>
            </div>
            <div id="logout-dropdown" class="logout-dropdown">
                <a href="/auth/logout.php">Sair</a>
            </div>
        </div>
    </header>

    <div class="container">
        <h1>Menu de Aplicações</h1>
        <p class="subtitle">Selecione uma das opções abaixo para continuar.</p>

        <div class="menu-opcoes">
            <a href="/html/menuNuv.php" class="menu-item">
                <i class="fas fa-chart-line"></i>
                <span>NUV Calculator</span>
            </a>
            <a href="/html/decodificador.php" class="menu-item">
                <i class="fas fa-users-cog"></i>
                <span>Decodificador de Modelos de TV</span>
            </a>
            <a href="/html/manutencao.html" class="menu-item">
                <i class="fas fa-cog"></i>
                <span>Integração Analyser</span>
            </a>
            <a href="/html/relatorioCanais.php" class="menu-item">
                <i class="fas fa-cog"></i>
                <span>LogAnalyzer</span>
            </a>
        </div>
    </div>
    <footer>
        <p>© Suporte Avançado/CGR - CDNTV - 2025 </p>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            // --- LÓGICA DO HEADER DE USUÁRIO ---
            const userMenu = document.querySelector('.user-menu');
            const userDisplay = document.getElementById('user-display');
            const logoutDropdown = document.getElementById('logout-dropdown');
            const usernamePlaceholder = document.getElementById('username-placeholder');

            if (userDisplay) {
                userDisplay.addEventListener('click', (e) => {
                    e.stopPropagation();
                    logoutDropdown.classList.toggle('show');
                    userMenu.classList.toggle('open');
                });
            }
            window.addEventListener('click', () => {
                if (logoutDropdown.classList.contains('show')) {
                    logoutDropdown.classList.remove('show');
                    userMenu.classList.remove('open');
                }
            });
            try {
                const response = await fetch('/auth/session_status.php');
                const session = await response.json();
                if (session.loggedIn) {
                    usernamePlaceholder.textContent = session.username;
                } else {
                    if (userMenu) userMenu.style.display = 'none';
                }
            } catch (error) {
                console.error('Erro ao buscar status da sessão:', error);
                if (userMenu) userMenu.style.display = 'none';
            }

            // --- LÓGICA DA TRANSIÇÃO DE PÁGINA ---
            document.body.classList.add('fade-in');
            const links = document.querySelectorAll('a:not([href^="#"]):not([target="_blank"]):not(.logout-btn)');
            links.forEach(link => {
                link.addEventListener('click', e => {
                    const destination = link.href;
                    if (destination) {
                        e.preventDefault();
                        document.body.classList.remove('fade-in');
                        setTimeout(() => {
                            window.location.href = destination;
                        }, 500);
                    }
                });
            });
        });
    </script>
</body>

</html>