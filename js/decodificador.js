// ==========================================
// PROTEÇÕES AVANÇADAS CONTRA INSPEÇÃO
// ==========================================

// Bloqueia o menu de contexto (clique direito)
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    showError('A inspeção desta página não é permitida.');
    return false;
});

// Bloqueia o uso de teclas de desenvolvedor
document.onkeydown = function (e) {
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')) {
        showError('A inspeção desta página não é permitida.');
        return false;
    }
};

// Bloqueia a abertura do console
setInterval(function () {
    if (window.console && console.log) {
        console.log = function () { };
        console.warn = function () { };
        console.error = function () { };
        console.info = function () { };
    }
}, 1000);

// ==========================================
// FUNCIONALIDADE DA APLICAÇÃO
// ==========================================

// Alternar entre abas
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

        this.classList.add('active');
        document.getElementById(this.getAttribute('data-tab') + '-tab').classList.add('active');
    });
});

// Função para mostrar erro
function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('warning').style.display = 'none';

    // Oculta o erro após 5 segundos
    setTimeout(function () {
        document.getElementById('error').style.display = 'none';
    }, 5000);
}

// Função para mostrar aviso
function showWarning(message) {
    document.getElementById('warning-message').textContent = message;
    document.getElementById('warning').style.display = 'block';

    // Oculta o aviso após 8 segundos
    setTimeout(function () {
        document.getElementById('warning').style.display = 'none';
    }, 8000);
}

// Função para mostrar resultado
function showResult(result) {
    document.getElementById('result-brand').textContent = result.brand;
    document.getElementById('result-model').textContent = result.model;
    document.getElementById('result-year').textContent = result.year;
    document.getElementById('result-region').textContent = result.region;
    document.getElementById('result-series').textContent = result.series;
    document.getElementById('result-size').textContent = result.size || '-';
    document.getElementById('result-positions').textContent = result.positions;
    document.getElementById('result-notes').textContent = result.notes || 'Nenhuma observação adicional';

    document.getElementById('result').style.display = 'block';
    document.getElementById('error').style.display = 'none';

    // Verifica se o modelo é anterior a 2021
    const yearValue = parseInt(result.year);
    if (!isNaN(yearValue) && yearValue < 2021) {
        showWarning('Modelo está em um ano ao qual não possuímos mais suporte. Aplicação pode conter erros.');
    }
}

// Função para decodificar o modelo
function decodeModel(brand) {
    const modelInput = document.getElementById(`${brand}-model`);
    const model = modelInput.value.trim().toUpperCase();

    if (!model) {
        showError('Por favor, digite um modelo válido.');
        return;
    }

    let result;

    if (brand === 'lg') {
        result = decodeLGModel(model);
    } else {
        result = decodeSamsungModel(model);
    }

    if (result.error) {
        showError(result.error);
    } else {
        showResult(result);
    }
}

// Função para decodificar modelos LG
function decodeLGModel(model) {
    if (model.length < 8) {
        return { error: 'Modelo muito curto. O código precisa ter pelo menos 8 caracteres.' };
    }

    const yearChar = model.charAt(6); // 7º caractere
    const regionChar = model.charAt(7); // 8º caractere

    // Decodifica o ano
    let year;
    switch (yearChar) {
        case '4': year = '2016'; break;
        case '5': year = '2017'; break;
        case '6': year = '2018'; break;
        case '7': year = '2019'; break;
        case '8':
        case '9': year = '2020'; break;
        case 'M': year = '2021'; break;
        case 'P': year = '2022'; break;
        case 'Q': year = '2023'; break;
        case 'S': year = '2024'; break;
        case 'T': year = '2025'; break;
        default: year = 'Ano não identificado';
    }

    // Decodifica a região
    let region;
    switch (regionChar) {
        case 'U': region = 'Estados Unidos (EUA)'; break;
        case 'C': region = 'Canadá'; break;
        case 'K': region = 'Coreia do Sul'; break;
        case 'E': region = 'Europa (geral)'; break;
        case 'A': region = 'Ásia (geral)'; break;
        case 'L': region = 'América Latina (Brasil, Argentina, México)'; break;
        case 'B': region = 'Reino Unido ou França'; break;
        case 'P': region = 'Itália ou Espanha'; break;
        case '6': case '7': case '9': region = 'Alemanha, Áustria e Suíça (região DACH)'; break;
        case '0': region = 'Europa (modelo genérico)'; break;
        default: region = 'Região não identificada';
    }

    // Identifica a série/linha
    let series;
    if (model.includes('NAN')) series = 'NanoCell';
    else if (model.includes('OLED')) series = 'OLED';
    else if (model.includes('QNED')) series = 'QNED';
    else if (model.startsWith('LM')) series = 'LED UHD';
    else if (model.startsWith('UM')) series = 'UHD';
    else if (model.startsWith('UP')) series = 'UHD Premium';
    else series = 'Série não identificada';

    // Extrai o tamanho da tela (primeiros números)
    const sizeMatch = model.match(/^\d+/);
    const size = sizeMatch ? `${sizeMatch[0]} polegadas` : null;

    // Observações específicas para modelos
    let notes = '';
    if (model === 'UM7470PSA') {
        notes = 'Para confirmação absoluta, verifique a etiqueta na parte de trás da TV ou o manual do usuário.';
    }

    return {
        brand: 'LG',
        model: model,
        year: year,
        region: region,
        series: series,
        size: size,
        positions: `7º caractere: '${yearChar}', 8º caractere: '${regionChar}'`,
        notes: notes
    };
}

// Função para decodificar modelos Samsung
function decodeSamsungModel(model) {
    if (model.length < 5) {
        return { error: 'Modelo muito curto. O código precisa ter pelo menos 5 caracteres.' };
    }

    // Extrai o tamanho da tela (primeiros números)
    const sizeMatch = model.match(/^\d+/);
    const size = sizeMatch ? `${sizeMatch[0]} polegadas` : null;

    // Encontra a posição do caractere do ano
    let yearChar = '';
    let yearPosition = 0;

    // Padrão comum: QN65Q80B -> o Q após 65 é o ano
    const pattern1 = model.match(/[A-Za-z]{2}\d{2}([A-Za-z])/);
    if (pattern1) {
        yearChar = pattern1[1];
        yearPosition = model.indexOf(yearChar) + 1;
    } else {
        // Tenta encontrar qualquer letra após os primeiros números
        const lettersAfterNumbers = model.match(/^\d+([A-Za-z])/);
        if (lettersAfterNumbers) {
            yearChar = lettersAfterNumbers[1];
            yearPosition = model.indexOf(yearChar) + 1;
        }
    }

    // Decodifica o ano da Samsung
    let year;
    switch (yearChar) {
        case 'J': year = '2015'; break;
        case 'K': year = '2016'; break;
        case 'M': year = '2017'; break;
        case 'N': year = '2018'; break;
        case 'R': year = '2019'; break;
        case 'T': year = '2020'; break;
        case 'Q': year = '2021'; break;
        case 'S': year = '2022'; break;
        case 'B': year = '2023'; break;
        case 'C': year = '2024'; break;
        case 'D': year = '2025'; break;
        default: year = 'Ano não identificado';
    }

    // Decodifica a região (últimos caracteres)
    const lastChars = model.slice(-2);
    let region;
    switch (lastChars) {
        case 'WW': region = 'Global/Mundial'; break;
        case 'ZX': region = 'Brasil'; break;
        case 'UE': region = 'Estados Unidos'; break;
        case 'RU': region = 'Europa'; break;
        case 'AR': region = 'Argentina'; break;
        case 'CL': region = 'Chile'; break;
        case 'CN': region = 'China'; break;
        case 'KR': region = 'Coreia'; break;
        default: region = 'Região não identificada';
    }

    // Identifica a série/linha
    let series;
    if (model.includes('QN')) series = 'QLED';
    else if (model.includes('QE')) series = 'QD-OLED';
    else if (model.includes('UN')) series = 'UHD';
    else if (model.includes('NU')) series = 'UHD';
    else if (model.includes('ES')) series = 'LED';
    else if (model.includes('KU')) series = 'SUHD';
    else series = 'Série não identificada';

    return {
        brand: 'Samsung',
        model: model,
        year: year,
        region: region,
        series: series,
        size: size,
        positions: yearChar ? `Caractere '${yearChar}' na posição ${yearPosition}, últimos caracteres: '${lastChars}'` : 'Padrão não identificado',
        notes: 'Para confirmação, consulte a etiqueta na parte de trás da TV.'
    };
}