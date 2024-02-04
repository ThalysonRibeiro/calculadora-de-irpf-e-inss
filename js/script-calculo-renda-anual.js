function formatarValor() {
    const camposRendimento = document.querySelectorAll('.campo-rendimento');

    camposRendimento.forEach(input => {
        let valorDigitado = input.value.replace(/[^\d]/g, '');

        valorDigitado = valorDigitado.replace(/^0+/, '');

        if (valorDigitado === '') {
            input.value = '';
        } else {
            const valorFormatado = parseFloat(valorDigitado) / 100;
            input.value = valorFormatado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        }
    });
}

function calcularImposto() {
    const camposRendimento = document.querySelectorAll('.campo-rendimento');

    const rendimento = Array.from(camposRendimento).map(input => parseFloat(input.value.replace(/[^\d]/g, '')));

    const deducaoSimplificada20Porcento = rendimento.reduce((acc, val) => acc + val, 0) * 0.20;
    let resultadoDe_DeducaoSimplificada20Porcento = 0;
    if (deducaoSimplificada20Porcento < 1675434) {
        resultadoDe_DeducaoSimplificada20Porcento = rendimento.reduce((acc, val) => acc + val, 0) * 0.80;
    } else {
        resultadoDe_DeducaoSimplificada20Porcento = rendimento.reduce((acc, val) => acc + val, 0) - 1675434;
    }

    const baseDeCalculo = rendimento.reduce((acc, val) => acc + val, 0) - resultadoDe_DeducaoSimplificada20Porcento;


    const calculadoraDeIrpf = {
        calcularImposto: function (deducaoSimplificada) {
            let aliquota = 0;
            let deducao = 0;

            if (deducaoSimplificada <= 2451192) {
                aliquota = 0;
                deducao = 0;
            } else if (deducaoSimplificada <= 3391980) {
                aliquota = 0.075;
                deducao = 183839;
            } else if (deducaoSimplificada <= 4501260) {
                aliquota = 0.15;
                deducao = 438238;
            } else if (deducaoSimplificada <= 5597616) {
                aliquota = 0.225;
                deducao = 775832;
            } else {
                aliquota = 0.275;
                deducao = 1055713;
            }

            const aliquotaDe15Porcento = deducaoSimplificada * aliquota;
            const parcelaADeduzir15Porcento = aliquotaDe15Porcento - deducao;

            const impostoDevido = parcelaADeduzir15Porcento / 100;
            const irEfetivoSobreRendimento = (impostoDevido / baseDeCalculo) * 100;

            document.getElementById('resultado').innerHTML = "<strong>Rendimentos tributáveis brutos:</strong> " + (rendimento.reduce((acc, val) => acc + val, 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'BRL' }) +
                "<br><strong>Desconto simplificado:</strong> " + (deducaoSimplificada / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'BRL' }) +
                "<br><strong>Base de cálculo:</strong> " + (baseDeCalculo / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'BRL' }) +
                "<br><strong>Imposto a pagar:</strong> " + impostoDevido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'BRL' });
        }
    }

    calculadoraDeIrpf.calcularImposto(resultadoDe_DeducaoSimplificada20Porcento);
}

function adicionarCampo() {
    const camposRendimento = document.getElementById('campos-rendimento');
    const novoCampo = document.createElement('div');
    novoCampo.innerHTML = `
        <label for="valorRendimento">Informe o valor do rendimento:</label>
        <input type="text" class="campo-rendimento" placeholder="Digite o valor" oninput="formatarValor()">
    `;
    camposRendimento.appendChild(novoCampo);
}

function removerCampo() {
    const camposRendimento = document.getElementById('campos-rendimento');
    if (camposRendimento.childElementCount > 1) {
        camposRendimento.lastChild.remove();
    }
}

function limparDados() {
    const camposRendimento = document.querySelectorAll('.campo-rendimento');
    camposRendimento.forEach(input => {
        input.value = '';
    });
    document.getElementById('resultado').innerHTML = '';
}