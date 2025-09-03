<?php require_once '../auth/check_session.php'; ?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/menu.css">
    <script src="/js/security.js"></script>
    <title>NUV-Calculator</title>
</head>
<body>
    <header class="user-header">
        <div class="user-menu">
            <div id="user-display" class="user-display">
                <span id="username-placeholder">Carregando...</span>
                <span class="arrow-down">▼</span>
            </div>
            <div id="logout-dropdown" class="logout-dropdown">
                <a href="/auth/logout.php">Sair</a>
            </div>
        </div>
    </header>
    
    <div class="container">
        <a href="https://cdn.tv.br/" class="logo-container">
            <img src="/images/cdntv.png" alt="cdntv-logo" width="300">
        </a>
        <h1>NUV - Calculator</h1>
        <nav class="menu">
            <a href="/html/calcestimado.php" class="menu-btn" id="btn-estimado">
                <span class="icon">📦</span>
                <span>Cálculo Estimado para Disco</span>
            </a>
            <a href="/html/calcomb.php" class="menu-btn" id="btn-comb">
                <span class="icon">🧮</span>
                <span>Cálculo de Combinações</span>
            </a>
            <a href="/html/doc.php" class="menu-btn" id="btn-doc">
                <span class="icon">📖</span>
                <span>Documentação</span>
            </a>
            <a href="../index.php" class="menu-btn" id="btn-doc">
                <span class="icon">🚪</span>
                <span>Voltar</span>
            </a>
        </nav>
    </div>

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