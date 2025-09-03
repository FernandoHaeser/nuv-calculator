<?php require_once '../auth/check_session.php'; ?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Oscilação de Canais</title>
    <link rel="stylesheet" href="/css/relatorioCanais.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>

    <div class="container">
        <header>
            <h1>Relatório de Oscilação</h1>
            <p class="subtitle">Consulte a estabilidade dos canais em tempo real</p>
        </header>

        <form id="report-form">
            <div class="form-group">
                <label for="ip-input">Endereço IP do Servidor Origin</label>
                <input type="text" id="ip-input" placeholder="Ex: 45.160.16.100" required>
            </div>

            <div class="form-group">
                <label for="period-select">Período do Relatório</label>
                <select id="period-select">
                    <option value="hoje">Hoje</option>
                    <option value="ontem">Ontem</option>
                    </select>
            </div>

            <button type="submit" id="submit-btn">Gerar Relatório</button>
        </form>

        <div id="loading-container" class="hidden">
            <div class="spinner"></div>
            <p>Buscando dados no servidor... Isso pode levar um momento.</p>
        </div>

        <div id="result-container">
            </div>

    </div>

    <script src="/js/relatorioCanais.js"></script>
</body>
</html>