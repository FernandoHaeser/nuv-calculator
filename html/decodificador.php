<?php require_once '../auth/check_session.php'; ?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Decodificador de Modelos de TV</title>
    <link rel="stylesheet" href="/css/decodificador.css">
    <script src="/js/security.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <noscript>
        <link rel="stylesheet" href="/css/noscript.css">
    </noscript>
</head>

<body>
    <header class="user-header">
        <a href="#" class="back-btn" onclick="history.back()">
            <i class="fas fa-arrow-left"></i>
        </a>
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
        <header class="content-header">
            <div class="logo">📺</div>
            <h1>Decodificador de Modelos de TV</h1>
            <p>Sistema de validação do ano do televisor.</p>
        </header>
        <div class="content">
            <div class="no-script">
                <h3>JavaScript Necessário</h3>
                <p>Esta aplicação requer JavaScript para funcionar corretamente. Por favor, ative o JavaScript em seu navegador.</p>
            </div>
            <div class="tabs">
                <div class="tab active" data-tab="lg">LG</div>
                <div class="tab" data-tab="samsung">Samsung</div>
            </div>
            <div class="tab-content active" id="lg-tab">
                <div class="form-group">
                    <label for="lg-model">Modelo da TV LG:</label>
                    <input type="text" id="lg-model" placeholder="Ex: 75NAN099UNA, LM625BPSB, UM7470PSA">
                </div>
                <button class="btn" onclick="decodeModel('lg')">Decodificar Modelo LG</button>
                <div class="examples">
                    <h3>Exemplos de modelos LG:</h3>
                    <div class="example-list">
                        <div class="example" onclick="document.getElementById('lg-model').value = '75NAN099UNA'">75NAN099UNA</div>
                        <div class="example" onclick="document.getElementById('lg-model').value = 'LM625BPSB'">LM625BPSB</div>
                        <div class="example" onclick="document.getElementById('lg-model').value = 'UM7470PSA'">UM7470PSA</div>
                        <div class="example" onclick="document.getElementById('lg-model').value = '50UR8750PSA'">50UR8750PSA</div>
                    </div>
                </div>
            </div>
            <div class="tab-content" id="samsung-tab">
                <div class="form-group">
                    <label for="samsung-model">Modelo da TV Samsung:</label>
                    <input type="text" id="samsung-model" placeholder="Ex: QN65Q80B, UN55NU7090, QE55S95B">
                </div>
                <button class="btn" onclick="decodeModel('samsung')">Decodificar Modelo Samsung</button>
                <div class="examples">
                    <h3>Exemplos de modelos Samsung:</h3>
                    <div class="example-list">
                        <div class="example" onclick="document.getElementById('samsung-model').value = 'QN65Q80B'">QN65Q80B</div>
                        <div class="example" onclick="document.getElementById('samsung-model').value = 'UN55NU7090'">UN55NU7090</div>
                        <div class="example" onclick="document.getElementById('samsung-model').value = 'QE55S95B'">QE55S95B</div>
                    </div>
                </div>
            </div>
            <div class="result" id="result">
                <h3>Resultado da Decodificação</h3>
                <div class="result-item">
                    <span class="result-label">Marca:</span>
                    <span id="result-brand">-</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Modelo:</span>
                    <span id="result-model">-</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Ano do Modelo:</span>
                    <span id="result-year">-</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Região/Mercado:</span>
                    <span id="result-region">-</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Série/Linha:</span>
                    <span id="result-series">-</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Tamanho da Tela:</span>
                    <span id="result-size">-</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Posições Analisadas:</span>
                    <span id="result-positions">-</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Observações:</span>
                    <span id="result-notes">-</span>
                </div>
            </div>
            <div class="warning" id="warning">
                <span id="warning-message"></span>
            </div>
            <div class="error" id="error">
                <span id="error-message"></span>
            </div>
            <div class="protection-note">
            </div>
        </div>
    </div>
    <footer>
        <p>© Suporte Avançado/CGR - CDNTV - 2025 </p>
    </footer>

    <script src="/js/decodificador.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            // Lógica para o header de usuário
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
                if (session.loggedIn && session.username) {
                    usernamePlaceholder.textContent = session.username;
                } else if (userMenu) {
                    userMenu.style.display = 'none';
                }
            } catch (error) {
                console.error('Erro ao buscar status da sessão:', error);
                if (userMenu) userMenu.style.display = 'none';
            }
        });
    </script>
</body>
</html>