<?php require_once '../auth/check_session.php'; ?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../css/estimado.css">
  <link rel="stylesheet" href="../css/menu.css">
  <title>Cálculo Estimado | NUV-Calculator</title>
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
    <h1>📦 Cálculo Estimado para Disco</h1>


    <form id="estimado-form" autocomplete="off">
      <div id="estimado-fields"></div>
      <button type="button" id="add-estimado" class="add-btn">+ Adicionar Tipo de Assinatura</button>
      <div class="button-group">
        <button type="submit" class="calc-btn">Calcular</button>
        <button type="button" id="clear-estimado" class="clear-btn">Limpar</button>
      </div>
    </form>

    <div id="resultadoEstimado" class="saida"></div>
    <a href="/html/menuNuv.php" class="back-btn">← Voltar ao Menu</a>
  </div>

  <div id="toast" class="toast"></div>
  <script src="../js/calcestimado.js"></script>
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