/**
 * @file Script para a página "Combinações de Assinaturas" (calcomb.html).
 * Ajustado para normalizar números e calcular % de uso.
 */

const MAX_LONG_VALUE = 10000000000n;

const assinaturaOptions = [
    { value: 1, label: "1 dia" },
    { value: 3, label: "3 dias" },
    { value: 7, label: "7 dias" },
    { value: 30, label: "30 dias" }
];

// --- Utils numéricos robustos ---
function normalizeNumber(v) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "bigint") return Number(v);
    if (typeof v === "string") {
        const cleaned = v.replace(',', '.').replace(/[^\d.+-Ee]/g, '');
        const parsed = parseFloat(cleaned);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    const coerce = Number(v);
    return Number.isFinite(coerce) ? coerce : 0;
}
function fmt2(n) { return normalizeNumber(n).toFixed(2); }
function clamp(n, min, max) { n = normalizeNumber(n); return Math.min(Math.max(n, min), max); }

function createCombField() {
    const div = document.createElement('div');
    div.className = "assinatura-item";
    div.innerHTML = `
    <div class="assinatura-row">
      <label class="assinatura-label">Assinatura (dias):</label>
      <div class="assinatura-switch">
        <div class="assinatura-select-group" style="display: flex;">
          <select class="assinatura-select">
            <option value="">Selecione...</option>
            ${assinaturaOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
          </select>
          <button type="button" class="toggle-manual-btn" title="Digitar manualmente">&#9998;</button>
        </div>
        <div class="assinatura-manual-group" style="display:none;">
          <div class="assinatura-input-wrapper">
            <input type="number" min="1" class="assinatura-input" placeholder="Dias" />
            <button type="button" class="input-arrow up" tabindex="-1">&#9650;</button>
            <button type="button" class="input-arrow down" tabindex="-1">&#9660;</button>
          </div>
          <button type="button" class="toggle-select-btn" title="Selecionar opção">&#8592;</button>
        </div>
      </div>
      <div class="quantidade-input-wrapper">
        <input type="number" min="1" class="quantidade-input" placeholder="Qtd de câmeras" value="1">
        <button type="button" class="input-arrow up" tabindex="-1">&#9650;</button>
        <button type="button" class="input-arrow down" tabindex="-1">&#9660;</button>
      </div>
      <button type="button" class="remove-btn" title="Remover">❌</button>
    </div>
  `;

    const selectGroup = div.querySelector('.assinatura-select-group');
    const manualGroup = div.querySelector('.assinatura-manual-group');
    const toggleManualBtn = div.querySelector('.toggle-manual-btn');
    const toggleSelectBtn = div.querySelector('.toggle-select-btn');

    toggleManualBtn.onclick = () => {
        selectGroup.style.display = 'none';
        manualGroup.style.display = 'flex';
        manualGroup.querySelector('.assinatura-input').focus();
    };
    toggleSelectBtn.onclick = () => {
        manualGroup.style.display = 'none';
        selectGroup.style.display = 'flex';
        selectGroup.querySelector('.assinatura-select').focus();
    };

    const diasInput = div.querySelector('.assinatura-input');
    const diasUp = manualGroup.querySelector('.input-arrow.up');
    const diasDown = manualGroup.querySelector('.input-arrow.down');
    diasUp.onclick = () => { diasInput.value = Math.max(1, (parseInt(diasInput.value) || 0) + 1); diasInput.focus(); };
    diasDown.onclick = () => { diasInput.value = Math.max(1, (parseInt(diasInput.value) || 2) - 1); diasInput.focus(); };

    const qtdInput = div.querySelector('.quantidade-input');
    const qtdUp = div.querySelector('.quantidade-input-wrapper .input-arrow.up');
    const qtdDown = div.querySelector('.quantidade-input-wrapper .input-arrow.down');
    qtdUp.onclick = () => { qtdInput.value = Math.max(1, (parseInt(qtdInput.value) || 0) + 1); qtdInput.focus(); };
    qtdDown.onclick = () => { qtdInput.value = Math.max(1, (parseInt(qtdInput.value) || 2) - 1); qtdInput.focus(); };

    div.querySelector('.remove-btn').onclick = () => div.remove();
    return div;
}

const combFields = document.getElementById('comb-fields');
const addCombBtn = document.getElementById('add-comb');
addCombBtn.onclick = () => combFields.appendChild(createCombField());
combFields.appendChild(createCombField());

document.getElementById('clear-comb').onclick = () => {
    const resultadoDiv = document.getElementById('resultadoComb');
    combFields.innerHTML = '';
    combFields.appendChild(createCombField());
    document.getElementById('totalTB').value = '0';
    resultadoDiv.innerHTML = '';
    resultadoDiv.style.display = 'none';
};

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

const incBtn = document.querySelector('.custom-inc-btn');
const decBtn = document.querySelector('.custom-dec-btn');
const tbInput = document.getElementById('totalTB');
if (incBtn && decBtn && tbInput) {
    incBtn.onclick = () => { let val = normalizeNumber(tbInput.value); tbInput.value = (val + 0.1).toFixed(1); };
    decBtn.onclick = () => { let val = normalizeNumber(tbInput.value); if (val > 0.1) tbInput.value = (val - 0.1).toFixed(1); };
}

function getCombData() {
    const tb = normalizeNumber(document.getElementById('totalTB').value);
    const fields = combFields.querySelectorAll('.assinatura-item');
    const itensMap = new Map();

    if (tb <= 0) return { data: null, error: 'O espaço total em TB deve ser maior que zero.' };

    for (const div of fields) {
        let diasStr, qtdStr;
        const selectGroup = div.querySelector('.assinatura-select-group');
        if (selectGroup.style.display !== 'none') {
            diasStr = div.querySelector('.assinatura-select').value;
        } else {
            diasStr = div.querySelector('.assinatura-input').value;
        }
        qtdStr = div.querySelector('.quantidade-input').value;

        if (!diasStr || !qtdStr || Number(diasStr) <= 0 || Number(qtdStr) <= 0) {
            div.classList.add('error');
            setTimeout(() => div.classList.remove('error'), 300);
            return { data: null, error: 'Preencha todos os campos corretamente!' };
        }

        const dias = Number(diasStr);
        const qtd = Number(qtdStr);

        if (itensMap.has(dias)) itensMap.set(dias, itensMap.get(dias) + qtd);
        else itensMap.set(dias, qtd);
    }

    const itens = [];
    for (const [dias, qtd] of itensMap.entries()) itens.push({ dias, qtd });

    for (const item of itens) {
        try {
            if (BigInt(item.qtd) > MAX_LONG_VALUE || BigInt(item.dias) > MAX_LONG_VALUE) {
                return { data: null, error: 'A quantidade total de uma assinatura é grande demais.' };
            }
        } catch {
            return { data: null, error: 'Número inválido detectado.' };
        }
    }
    return { data: { tb: tb, itens }, error: null };
}

document.getElementById('comb-form').onsubmit = async (e) => {
    e.preventDefault();

    const { data, error } = getCombData();
    if (error) { 
        showToast(error); 
        return; 
    }

    const resultadoDiv = document.getElementById('resultadoComb');
    resultadoDiv.innerHTML = `
        <div class="loading-container">
            <div class="loader"></div>
            <span>Calculando melhor combinação...</span>
        </div>
    `;
    resultadoDiv.style.display = 'block';

    try {
        const response = await fetch("/api/combinacoes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erro na comunicação com a API.");

        const resultado = await response.json();
        if (!resultado || !resultado.length) {
            resultadoDiv.innerHTML = `<p class="error-message">Nenhuma combinação encontrada.</p>`;
            showToast("Nenhuma combinação encontrada!");
            return;
        }

        const melhor = resultado[0]; // Melhor combinação
        const totalStorageMb = normalizeNumber(data.tb) * 1024 * 1024; // total disponível em MB
        const usedMb = normalizeNumber(melhor.mb); // total usado pela combinação
        const usoPercent = clamp((usedMb / totalStorageMb) * 100, 0, 100).toFixed(1);
        const usedTb = (usedMb / 1024 / 1024).toFixed(2); // convertido para TB

        const combinacaoStr = melhor.quant
            .map((q, j) => q > 0 ? `<span class="license-tag">${q} assinaturas de ${data.itens[j].dias} dias</span>` : "")
            .filter(x => x)
            .join(" ");

        resultadoDiv.innerHTML = `
            <div class="result-item best-result fadeResult">
                <div class="result-header">
                    <b>🏆 Melhor Cenário de Otimização</b>
                    <span class="best-badge">Melhor</span>
                </div>
                <div class="result-body">
                    ${combinacaoStr || '<span class="license-tag">Nenhuma licença selecionada</span>'}
                </div>
                <div class="result-footer">
                    <span style="font-size:1.3rem; color:#ffae5e;"><b>${usedTb} TB</b></span>
                    <span class="usage-percent">(${usoPercent}% de uso)</span>
                </div>
                <div class="usage-bar-container" style="margin-top:10px; background:#393939; border-radius:10px; height:12px; overflow:hidden;">
                    <div class="usage-bar" style="width:${usoPercent}%; height:100%; background:#ffae5e; transition: width 0.6s;"></div>
                </div>
            </div>
        `;

        showToast("Melhor combinação calculada!");
    } catch (err) {
        console.error(err);
        resultadoDiv.innerHTML = `<p class="error-message">Erro ao processar a requisição.</p>`;
        showToast("Erro ao conectar com a API.");
    }
};