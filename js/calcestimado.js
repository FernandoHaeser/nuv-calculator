/**
 * @file Script para a página "Cálculo Estimado de Disco" (calcestimado.html).
 * Ajustado para normalizar números antes de usar toFixed.
 */

const MAX_LONG_VALUE = 9223372036854775807n;

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

function createEstimadoField() {
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
        <input type="number" min="1" class="quantidade-input" placeholder="Qtd">
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
  diasDown.onclick = () => { diasInput.value = Math.max(1, (parseInt(diasInput.value) || 1) - 1); diasInput.focus(); };

  const qtdInput = div.querySelector('.quantidade-input');
  const qtdUp = div.querySelector('.quantidade-input-wrapper .input-arrow.up');
  const qtdDown = div.querySelector('.quantidade-input-wrapper .input-arrow.down');
  qtdUp.onclick = () => { qtdInput.value = Math.max(1, (parseInt(qtdInput.value) || 0) + 1); qtdInput.focus(); };
  qtdDown.onclick = () => { qtdInput.value = Math.max(1, (parseInt(qtdInput.value) || 1) - 1); qtdInput.focus(); };

  div.querySelector('.remove-btn').onclick = () => div.remove();
  return div;
}

const estimadoFields = document.getElementById('estimado-fields');
const addEstimadoBtn = document.getElementById('add-estimado');

addEstimadoBtn.onclick = () => estimadoFields.appendChild(createEstimadoField());
estimadoFields.appendChild(createEstimadoField());

document.getElementById('clear-estimado').onclick = () => {
  const resultadoDiv = document.getElementById('resultadoEstimado');
  estimadoFields.innerHTML = '';
  resultadoDiv.innerHTML = '';
  resultadoDiv.style.display = 'none';
  estimadoFields.appendChild(createEstimadoField());
};

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function getEstimadoData() {
  const fields = estimadoFields.querySelectorAll('.assinatura-item');
  let licencas = [], quantidades = [];

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

    try {
      if (BigInt(diasStr) > MAX_LONG_VALUE || BigInt(qtdStr) > MAX_LONG_VALUE) {
        return { data: null, error: 'Valor muito grande.' };
      }
    } catch {
      return { data: null, error: 'Insira apenas números válidos.' };
    }

    licencas.push(Number(diasStr));
    quantidades.push(Number(qtdStr));
  }
  return { data: { licencas, quantidades }, error: null };
}

document.getElementById('estimado-form').onsubmit = async (e) => {
  e.preventDefault();
  const { data, error } = getEstimadoData();
  if (error) { showToast(error); return; }

  const resultadoDiv = document.getElementById('resultadoEstimado');
  resultadoDiv.innerHTML = `
    <div class="loading-container">
      <div class="loader"></div>
      Calculando...
    </div>
  `;
  resultadoDiv.style.display = 'block';

  try {
    const response = await fetch('/api/estimado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erro na API');

    const resultadoJson = await response.json();
    const bruto = resultadoJson.resultado ?? resultadoJson.total ?? 0;
    const valor = normalizeNumber(bruto);

    resultadoDiv.innerHTML = `
      <div class="result-item">
        <div class="result-header">
          <span>📦 Total Estimado</span>
        </div>
        <div class="result-body">
          <span class="license-tag">Espaço necessário: ${fmt2(valor)} TB</span>
        </div>
        <div class="result-footer">
          <span class="usage-percent">⚠️Este valor é uma estimativa do armazenamento total necessário⚠️</span>
        </div>
      </div>
    `;

    showToast('Cálculo realizado!');
  } catch (err) {
    resultadoDiv.innerHTML = `<span class="error-message">Erro: ${err.message}</span>`;
    showToast('Erro ao processar!');
  }
};