class CaixaDaLanchonete {
    constructor() {
        this.cardapio = new Cardapio();
        this.formasDePagamento = new FormasDePagamento();
    }

    calcularValorDaCompra(metodoDePagamento, itens) {
        if (!this.formasDePagamento.verificarFormaDePagamento(metodoDePagamento)) {
            return 'Forma de pagamento inválida!';
        }
        if (itens.length === 0) {
            return 'Não há itens no carrinho de compra!';
        }
        let total = 0;
        const itensSelecionados = {};
        const itensPrincipais = [];
        const itensExtras = [];
        for (const item of itens) {
            const [codigo, quantidade] = item.split(',');
            const itemMenu = this.cardapio.buscarItemPorCodigo(codigo.trim());

            if (itemMenu) {
                if (!itemMenu.descricao.includes('(extra')) {
                    itensPrincipais.push(itemMenu);
                } else {
                    itensExtras.push(itemMenu);
                }
                if (!quantidade || parseInt(quantidade) <= 0) {
                    return 'Quantidade inválida!';
                }
                const descricaoItem = itemMenu.descricao;
                itensSelecionados[descricaoItem] = (itensSelecionados[descricaoItem] || 0) + parseInt(quantidade);
                total += itemMenu.valor * parseInt(quantidade);
            } else {
                return 'Item inválido!';
            }
        }
        const erroItensExtras = this.verificarItensExtras(itensPrincipais, itensExtras);
        if (erroItensExtras) {
            return erroItensExtras;
        }

        if (metodoDePagamento === 'dinheiro') {
            total *= 0.95;
        } else if (metodoDePagamento === 'credito') {
            total *= 1.03;
        }
        const formattedTotal = `R$ ${total.toFixed(2).replace('.', ',')}`;

        return formattedTotal;
    
    }

    verificarItensExtras(itensPrincipais, itensExtras) {
        for (const extra of itensExtras) {
            if (
                extra.codigo.includes('chantily') &&
                !itensPrincipais.some((principal) => principal.codigo.includes('cafe'))
            ) {
                return 'Item extra não pode ser pedido sem o principal';
            } else if (
                extra.codigo.includes('queijo') &&
                !itensPrincipais.some((principal) => principal.codigo.includes('sanduiche'))
            ) {
                return 'Item extra não pode ser pedido sem o principal';
            }
        }
        return null;
    }
}

class Cardapio {
    constructor() {
        this.itens = [
            { codigo: 'cafe', descricao: 'Café', valor: 3.0 },
            { codigo: 'chantily', descricao: 'Chantily (extra do Café)', valor: 1.5 },
            { codigo: 'suco', descricao: 'Suco Natural', valor: 6.2 },
            { codigo: 'sanduiche', descricao: 'Sanduíche', valor: 6.5 },
            { codigo: 'queijo', descricao: 'Queijo (extra do Sanduíche)', valor: 2.0 },
            { codigo: 'salgado', descricao: 'Salgado', valor: 7.25 },
            { codigo: 'combo1', descricao: '1 Suco e 1 Sanduíche', valor: 9.5 },
            { codigo: 'combo2', descricao: '1 Café e 1 Sanduíche', valor: 7.5 },
        ];
    }
    buscarItemPorCodigo(codigo) {
        return this.itens.find((item) => item.codigo === codigo);
    }
}

class FormasDePagamento {
    constructor() {
        this.formas = ['dinheiro', 'debito', 'credito'];
    }

    verificarFormaDePagamento(forma) {
        return this.formas.includes(forma);
    }
}

export { CaixaDaLanchonete };


