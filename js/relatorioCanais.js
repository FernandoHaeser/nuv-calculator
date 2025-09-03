document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('report-form');
    const ipInput = document.getElementById('ip-input');
    const periodSelect = document.getElementById('period-select');
    const submitBtn = document.getElementById('submit-btn');
    const loadingContainer = document.getElementById('loading-container');
    const resultContainer = document.getElementById('result-container');

    reportForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const ip = ipInput.value.trim();
        const periodo = periodSelect.value;

        if (!ip) {
            alert('Por favor, insira um endereço IP.');
            return;
        }

        loadingContainer.classList.remove('hidden');
        resultContainer.innerHTML = '';
        submitBtn.disabled = true;

        try {
            // URL da API Python Flask
            const apiUrl = `http://127.0.0.1:5000/api/report?ip=${ip}&periodo=${periodo}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                let errorText = response.statusText;
                try {
                    const errorData = await response.json();
                    errorText = errorData.error || errorData.message || errorText;
                } catch (_) {}
                throw new Error(errorText);
            }

            const data = await response.json();
            renderResults(data);

        } catch (error) {
            renderError(error.message);
        } finally {
            loadingContainer.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    function renderResults(data) {
        if (!Array.isArray(data) || data.length === 0 || data.message) {
            resultContainer.innerHTML = `<p class="error-message">${data.message || 'Nenhum dado encontrado para o período informado.'}</p>`;
            return;
        }

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

        const rows = data.map(row => `
            <tr>
                <td>${row['Nome do Canal']}</td>
                <td>${row['UID do Canal']}</td>
                <td>${row['QTT']}</td>
                <td>${row['Tempo Médio de Oscilação']}</td>
                <td>${row['Total de Oscilações (%)']}%</td>
            </tr>
        `).join('');

        resultContainer.innerHTML = `<table class="results-table">${headers}<tbody>${rows}</tbody></table>`;
    }

    function renderError(message) {
        resultContainer.innerHTML = `<p class="error-message">Falha ao gerar o relatório: ${message}</p>`;
    }
});
