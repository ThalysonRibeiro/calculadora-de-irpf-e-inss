function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function atualizarFormatoMoeda(input) {
    const valorSemFormato = parseFloat(input.value.replace(/\D/g, '')) / 100;
    input.value = formatarMoeda(valorSemFormato);
}

function adicionarRenda() {
    const rendasContainer = document.getElementById('rendasContainer');
    const novaRendaContainer = document.createElement('div');
    novaRendaContainer.classList.add('rendaInputContainer');

    novaRendaContainer.innerHTML = `
        <label for="rendaAdicional">Digite sua renda adicional:</label>
        <input type="text" class="rendaInput" name="rendaAdicional[]"
            oninput="atualizarFormatoMoeda(this)" required>
        <button type="button" class="removerRendaButton"
            onclick="removerRenda(this)">Remover</button>
    `;

    rendasContainer.appendChild(novaRendaContainer);
}

function removerRenda(button) {
    const rendaContainer = button.parentNode;
    const rendasContainer = document.getElementById('rendasContainer');
    rendasContainer.removeChild(rendaContainer);
}

function limparCampos() {
    const inputs = document.getElementsByClassName('rendaInput');
    for (let input of inputs) {
        input.value = '';
    }

    // Limpar o resultado
    document.getElementById('resultadoImposto').innerHTML = '';
}

function calcularImposto() {
    const rendas = document.getElementsByName('rendaAdicional[]');
    const deducaoSimplificada20Porcento = Array.from(rendas)
        .map(renda => parseFloat(renda.value.replace(/\D/g, '')) / 100)
        .reduce((total, renda) => total + renda, 0) * 0.80;

    let aliquota = 0;
    let deducao = 0;

    if (deducaoSimplificada20Porcento <= 24511.92) {
        aliquota = 0;
        deducao = 0;
    } else if (deducaoSimplificada20Porcento <= 33919.80) {
        aliquota = 0.075;
        deducao = 1838.39;
    } else if (deducaoSimplificada20Porcento <= 45012.60) {
        aliquota = 0.15;
        deducao = 4382.38;
    } else if (deducaoSimplificada20Porcento <= 55976.16) {
        aliquota = 0.225;
        deducao = 7758.32;
    } else {
        aliquota = 0.275;
        deducao = 10557.13;
    }

    const impostoDevido = (deducaoSimplificada20Porcento * aliquota) - deducao;
    const resultadoImposto = impostoDevido <= 0 ?
        "Você está isento de imposto." :
        "Imposto a pagar: " + formatarMoeda(impostoDevido);

    // Exibir o resultado na página
    document.getElementById('resultadoImposto').innerHTML = resultadoImposto;
}