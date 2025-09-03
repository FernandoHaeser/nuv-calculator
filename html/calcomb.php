<?php require_once '../auth/check_session.php'; ?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/estimado.css">
    <link rel="stylesheet" href="../css/menu.css">
    <script src="/js/security.js"></script>
    <title>Combinações | NUV-Calculator</title>
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
        <h1>📦 Combinações de Assinaturas</h1>
        <!--<p class="subtitle">Descubra a melhor forma de usar seu espaço em disco com as licenças que você tem.</p> -->

        <form id="comb-form" autocomplete="off">
            <div class="input-section">

                <div class="assinatura-item">
                    <div class="assinatura-row">
                        <label class="assinatura-label">Espaço Total (TB):</label>
                        <div class="quantidade-input-wrapper">
                            <input type="number" step="0.1" min="0.1" class="quantidade-input" id="totalTB"
                                placeholder="TB" value="0" />
                            <button type="button" class="input-arrow up custom-inc-btn" tabindex="-1">&#9650;</button>
                            <button type="button" class="input-arrow down custom-dec-btn" tabindex="-1">&#9660;</button>
                        </div>
                    </div>
                </div>

                <div id="comb-fields"></div>

                <button type="button" id="add-comb" class="add-btn">+ Adicionar Tipo de Assinatura</button>
            </div>

            <div class="button-group">
                <button type="submit" id="calc-comb" class="calc-btn">Otimizar</button>
                <button type="button" id="clear-comb" class="clear-btn">Limpar</button>
            </div>
        </form>

        <div id="resultadoComb" class="saida"></div>

        <a href="/html/menuNuv.php" class="back-btn">← Voltar ao Menu</a>
    </div>

    <div id="toast" class="toast"></div>

    <script src="../js/calcomb.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            const userMenu = document.querySelector('.user-menu');
            const userDisplay = document.getElementById('user-display');
            const logoutDropdown = document.getElementById('logout-dropdown');
            const usernamePlaceholder = document.getElementById('username-placeholder');

            // Lógica para abrir/fechar o dropdown
            if (userDisplay) {
                userDisplay.addEventListener('click', (e) => {
                    e.stopPropagation(); // Impede que o clique feche o menu imediatamente
                    logoutDropdown.classList.toggle('show');
                    userMenu.classList.toggle('open');
                });
            }

            // Fecha o dropdown se o usuário clicar fora dele
            window.addEventListener('click', () => {
                if (logoutDropdown.classList.contains('show')) {
                    logoutDropdown.classList.remove('show');
                    userMenu.classList.remove('open');
                }
            });

            // Busca e exibe o nome do usuário logado
            try {
                const response = await fetch('/auth/session_status.php');
                const session = await response.json();
                if (session.loggedIn) {
                    usernamePlaceholder.textContent = session.username;
                } else {
                    // Se por algum motivo não estiver logado, esconde o menu
                    if (userMenu) userMenu.style.display = 'none';
                }
            } catch (error) {
                console.error('Erro ao buscar status da sessão:', error);
                if (userMenu) userMenu.style.display = 'none';
            }
        });
    </script>
</body>

</html>