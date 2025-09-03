// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do DOM uma vez para melhor performance
    const reportForm = document.getElementById('report-form');
    const ipInput = document.getElementById('ip-input');
    const periodSelect = document.getElementById('period-select');
    const submitBtn = document.getElementById('submit-btn');
    const loadingContainer = document.getElementById('loading-container');
    const resultContainer = document.getElementById('result-container');

    // Adiciona o listener para o envio do formulário
    reportForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        const ip = ipInput.value.trim();
        const periodo = periodSelect.value;

        // Validação simples do campo de IP
        if (!ip) {
            alert('Por favor, insira um endereço IP.');
            return;
        }

        // --- Inicia o feedback visual para o usuário ---
        loadingContainer.classList.remove('hidden');
        resultContainer.innerHTML = ''; // Limpa resultados antigos
        submitBtn.disabled = true; // Desabilita o botão para evitar cliques múltiplos

        try {
            // Constrói a URL da API.
            // Usa uma rota relativa, que funcionará perfeitamente com o Apache.
            const apiUrl = `/api/python/report?ip=${ip}&periodo=${periodo}`;

            // Chama a API
            const response = await fetch(apiUrl);

            // Verifica se a resposta da rede foi bem-sucedida
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro do servidor: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Renderiza os resultados
            renderResults(data);

        } catch (error) {
            // Em caso de erro de rede ou da API, exibe uma mensagem
            renderError(error.message);
        } finally {
            // --- Finaliza o feedback visual ---
            loadingContainer.classList.add('hidden');
            submitBtn.disabled = false; // Reabilita o botão
        }
    });

    /**
     * Renderiza a tabela de resultados a partir dos dados da API.
     * @param {Array} data - Os dados do relatório.
     */
    function renderResults(data) {
        // Se a API retornar uma mensagem (ex: "Nenhum dado encontrado")
        if (data.message || !Array.isArray(data) || data.length === 0) {
            resultContainer.innerHTML = `<p class="error-message">${data.message || 'Nenhum dado encontrado para o período informado.'}</p>`;
            return;
        }

        // Cria os cabeçalhos da tabela
        const headers = `
            <thead>
                <tr>
                    <th>Nome do Canal</th>
                    <th>UID do Canal</th>
                    <th>Qtd. Oscilações</th>
                    <th>Tempo Médio</th>
                    <th>Total de Oscilações (%)</th>
                </tr>
            </thead>
        `;

        // Cria as linhas da tabela mapeando sobre os dados
        const rows = data.map(row => `
            <tr>
                <td>${row['Nome do Canal']}</td>
                <td>${row['UID do Canal']}</td>
                <td>${row['QTT']}</td>
                <td>${row['Tempo Médio de Oscilação']}</td>
                <td>${row['Total de Oscilações (%)']}%</td>
            </tr>
        `).join(''); // .join('') transforma o array de strings em uma única string

        // Monta a tabela completa e a insere no contêiner de resultados
        resultContainer.innerHTML = `<table class="results-table">${headers}<tbody>${rows}</tbody></table>`;
    }

    /**
     * Exibe uma mensagem de erro no contêiner de resultados.
     * @param {string} message - A mensagem de erro a ser exibida.
     */
    function renderError(message) {
        resultContainer.innerHTML = `<p class="error-message">Falha ao gerar o relatório: ${message}</p>`;
    }
});