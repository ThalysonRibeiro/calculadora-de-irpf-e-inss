const calculadoraDeDescontoIrpfMes = {
    salarioDoMesParaCalculo: 2500.00,
    faixasINSS: [
        { limite: 1320.00, aliquota: 7.5 },
        { limite: 2571.29, aliquota: 9 },
        { limite: 3856.94, aliquota: 12 },
        { limite: Infinity, aliquota: 14 }
    ],
    faixasIRPF: [
        { limite: 2112.00, aliquota: 0, deducao: 0 },
        { limite: 2826.65, aliquota: 7.5, deducao: 158.40 },
        { limite: 3751.05, aliquota: 15, deducao: 370.40 },
        { limite: 4664.67, aliquota: 22.5, deducao: 651.73 },
        { limite: Infinity, aliquota: 27.5, deducao: 884.96 }
    ],

    calcularDesconto: function (faixas) {
        let salarioParaCalculo = this.salarioDoMesParaCalculo;
        let totalDesconto = 0;
        let faixaAnterior = 0;

        for (let faixa of faixas) {
            if (salarioParaCalculo <= faixa.limite) {
                totalDesconto += (salarioParaCalculo - faixaAnterior) * faixa.aliquota / 100;
                break;
            } else {
                totalDesconto += (faixa.limite - faixaAnterior) * faixa.aliquota / 100;
                faixaAnterior = faixa.limite;
            }
        }

        return totalDesconto;
    },

    calcularDescontoINSS: function () {
        return this.calcularDesconto(this.faixasINSS);
    },

    calcularDescontoIRPF: function () {
        const descontoINSS = this.calcularDescontoINSS();
        const salarioBase = this.salarioDoMesParaCalculo - descontoINSS;

        for (let faixa of this.faixasIRPF) {
            if (salarioBase <= faixa.limite) {
                return (salarioBase * faixa.aliquota / 100) - faixa.deducao;
            }
        }
    },

    calcularSalarioMes2024: function () {
        const descontoINSS = this.calcularDescontoINSS();
        const descontoIRPF = this.calcularDescontoIRPF();
        const salarioLiquido = this.salarioDoMesParaCalculo - descontoINSS - descontoIRPF;

        const resultado = document.getElementById('resultado');
        if (this.salarioDoMesParaCalculo <= 2112.00) {
            resultado.innerHTML = "Desconto INSS: R$ " + descontoINSS.toFixed(2) + "<br>" +
                "Não é necessário pagar IRPF.<br>" +
                "Salário Líquido: R$ " + salarioLiquido.toFixed(2);
        } else {
            resultado.innerHTML = "Desconto INSS: R$ " + descontoINSS.toFixed(2) + "<br>" +
                "Desconto IRPF: R$ " + descontoIRPF.toFixed(2) + "<br>" +
                "Salário Líquido: R$ " + salarioLiquido.toFixed(2);
        }
    }
}

function formatarMoeda() {
    var elemento = document.getElementById('salario');
    var valor = elemento.value;

    valor = valor + '';
    valor = parseInt(valor.replace(/[\D]+/g, ''));
    valor = valor + '';
    valor = valor.replace(/([0-9]{2})$/g, ",$1");

    if (valor.length > 6) {
        valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }

    elemento.value = valor;
}

function calcular() {
    const salario = document.getElementById('salario').value;
    calculadoraDeDescontoIrpfMes.salarioDoMesParaCalculo = salario.replace('.', '').replace(',', '.');
    calculadoraDeDescontoIrpfMes.calcularSalarioMes2024();

    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `
        <p><strong>Desconto INSS:</strong> R$ ${descontoINSS.toFixed(2)}</p>
        <p><strong>Desconto IRPF:</strong> R$ ${descontoIRPF.toFixed(2)}</p>
        <p><strong>Salário Líquido:</strong> R$ ${salarioLiquido.toFixed(2)}</p>
    `;
}