<?php require_once '../auth/check_session.php'; ?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/doc.css">
    <link rel="stylesheet" href="../css/menu.css">
    <script src="/js/doc.js"></script>
    <script src="/js/security.js"></script>
    <title>Guia de Uso | NUV-Calculator</title>
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
    <div class="container guia-container">
        <h1>📚 Guia de Uso</h1>

        <div class="guia-columns">

            <div class="guia-section">
                <h2>Cálculo Estimado</h2>
                <p>
                    Esta ferramenta é ideal para quem já tem uma lista de licenças e quer saber o <strong>espaço
                        total</strong> em disco que elas consomem.
                </p>
                <ul>
                    <li><strong>Assinatura (dias)</strong>: Adicione os tipos de assinatura que você possui. Você pode
                        selecionar uma opção pré-definida ou digitar um valor personalizado.</li>
                    <li><strong>Qtd</strong>: Digite a quantidade de licenças para cada tipo de assinatura.</li>
                    <li><strong>Botão "Calcular"</strong>: Clique para obter o resultado do espaço total estimado em TB
                        (Terabytes).</li>
                    <li><strong>Botão "Limpar"</strong>: Limpa todos os campos para iniciar um novo cálculo.</li>
                </ul>
            </div>

            <div class="guia-section">
                <h2>Combinações</h2>
                <p>
                    Use esta ferramenta para descobrir quais combinações de licenças cabem em um <strong>espaço de
                        disco</strong> que você já
                    possui ou planeja comprar.
                </p>
                <ul>
                    <li><strong>Espaço Total (TB)</strong>: Digite o tamanho total do seu disco em Terabytes.</li>
                    <li><strong>Assinatura (dias)</strong>: Adicione os tipos de licenças disponíveis que você deseja
                        usar na
                        combinação.</li>
                    <li><strong>Botão "Otimizar"</strong>: O sistema encontrará o melhor cenário de uso, ou seja, a
                        combinação de licenças que mais se aproxima do espaço total.</li>
                    <li><strong>Botão "Limpar"</strong>: Limpa os campos para um novo cálculo.</li>
                </ul>
            </div>

        </div>

        <a href="/html/menuNuv.php" class="back-btn">← Voltar ao Menu</a>
    </div>
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