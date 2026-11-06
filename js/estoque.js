/* ============================================================================
   APEX MOTORS - modulo de estoque de veiculos
   Autores: Bruno Lodi e Pietro Ferreira dos Santos
   Conteudo: base de dados em array de objetos, filtros, ordenacao, favoritos
   gravados em localStorage e calculadora de financiamento.
   ============================================================================ */
'use strict';

const APX_ESTOQUE = [
    {
        id: 'toro-freedom',
        marca: 'Fiat',
        modelo: 'Toro Freedom',
        versao: '1.8 AT6 Flex',
        ano: 2023,
        categoria: 'picape',
        combustivel: 'flex',
        cambio: 'automático',
        km: 28400,
        preco: 152900,
        foto: 'img/fiat-toro.jpg',
        condicao: 'seminovo',
        destaque: true
    },
    {
        id: 'compass-longitude',
        marca: 'Jeep',
        modelo: 'Compass Longitude',
        versao: 'T270 Turbo Flex',
        ano: 2022,
        categoria: 'suv',
        combustivel: 'flex',
        cambio: 'automático',
        km: 41200,
        preco: 168500,
        foto: 'img/jeep-compass.jpg',
        condicao: 'seminovo',
        destaque: true
    },
    {
        id: 'corolla-cross',
        marca: 'Toyota',
        modelo: 'Corolla Cross XRE',
        versao: '2.0 Dynamic Force',
        ano: 2022,
        categoria: 'suv',
        combustivel: 'flex',
        cambio: 'cvt',
        km: 33700,
        preco: 189900,
        foto: 'img/toyota-corolla.jpg',
        condicao: 'seminovo',
        destaque: false
    },
    {
        id: 'hrv-exl',
        marca: 'Honda',
        modelo: 'HR-V EXL',
        versao: '1.5 CVT',
        ano: 2023,
        categoria: 'suv',
        combustivel: 'flex',
        cambio: 'cvt',
        km: 18900,
        preco: 176400,
        foto: 'img/honda-hrv.jpg',
        condicao: 'seminovo',
        destaque: true
    },
    {
        id: 'tcross-comfortline',
        marca: 'Volkswagen',
        modelo: 'T-Cross Comfortline',
        versao: '200 TSI',
        ano: 2021,
        categoria: 'suv',
        combustivel: 'flex',
        cambio: 'automático',
        km: 52600,
        preco: 138700,
        foto: 'img/vw-tcross.jpg',
        condicao: 'usado',
        destaque: false
    },
    {
        id: 'creta-attitude',
        marca: 'Hyundai',
        modelo: 'Creta Attitude',
        versao: '1.6 16V',
        ano: 2020,
        categoria: 'suv',
        combustivel: 'flex',
        cambio: 'automático',
        km: 67300,
        preco: 112900,
        foto: 'img/hyundai-creta.jpg',
        condicao: 'usado',
        destaque: false
    },
    {
        id: 'onix-activ',
        marca: 'Chevrolet',
        modelo: 'Onix Activ',
        versao: '1.4 8V',
        ano: 2020,
        categoria: 'hatch',
        combustivel: 'flex',
        cambio: 'automático',
        km: 71800,
        preco: 89900,
        foto: 'img/chevrolet-onix.jpg',
        condicao: 'usado',
        destaque: false
    },
    {
        id: 'kicks-exclusive',
        marca: 'Nissan',
        modelo: 'Kicks Exclusive',
        versao: '1.6 CVT',
        ano: 2021,
        categoria: 'suv',
        combustivel: 'flex',
        cambio: 'cvt',
        km: 49100,
        preco: 124500,
        foto: 'img/nissan-kicks.jpg',
        condicao: 'seminovo',
        destaque: false
    },
    {
        id: 'dolphin-gs',
        marca: 'BYD',
        modelo: 'Dolphin Mini GS',
        versao: '405 km de autonomia',
        ano: 2024,
        categoria: 'hatch',
        combustivel: 'elétrico',
        cambio: 'automático',
        km: 9400,
        preco: 132800,
        foto: 'img/byd-dolphin.jpg',
        condicao: 'novo',
        destaque: true
    },
    {
        id: 'c4-cactus-feel',
        marca: 'Citroën',
        modelo: 'C4 Cactus Feel',
        versao: '1.6 16V',
        ano: 2019,
        categoria: 'suv',
        combustivel: 'flex',
        cambio: 'automático',
        km: 84200,
        preco: 78400,
        foto: 'img/citroen-c4.jpg',
        condicao: 'usado',
        destaque: false
    }
];

const APX_CATEGORIAS = [
    { chave: 'todos', rotulo: 'Todos', teste: () => true },
    { chave: 'suv', rotulo: 'SUV', teste: (c) => c.categoria === 'suv' },
    { chave: 'hatch', rotulo: 'Hatch', teste: (c) => c.categoria === 'hatch' },
    { chave: 'picape', rotulo: 'Picape', teste: (c) => c.categoria === 'picape' },
    { chave: 'eletrico', rotulo: 'Elétrico', teste: (c) => c.combustivel === 'elétrico' },
    { chave: 'ate130', rotulo: 'Até R$ 130 mil', teste: (c) => c.preco <= 130000 },
    { chave: 'novos', rotulo: 'Seminovos', teste: (c) => c.condicao !== 'usado' }
];

const APX_ROTULO_CONDICAO = {
    novo: 'Novo',
    seminovo: 'Seminovo',
    usado: 'Usado'
};

const APX_CLASSE_CONDICAO = {
    novo: 'apx-fita--novo',
    seminovo: 'apx-fita--seminovo',
    usado: 'apx-fita--usado'
};

let apxFiltroAtual = 'todos';
let apxOrdenacaoAtual = 'relevancia';
let apxFavoritos = [];

function apxCarregarFavoritos() {
    const dados = apxLerJson(APX_CHAVE_GARAGEM, []);
    apxFavoritos = Array.isArray(dados) ? dados : [];
    return apxFavoritos;
}

function apxSalvarFavoritos() {
    apxGravarJson(APX_CHAVE_GARAGEM, apxFavoritos);
    apxAtualizarContadorGaragem();
}

function apxAtualizarContadorGaragem() {
    const alvos = apxSelecionarTodos('[data-garagem-contador]');
    for (let i = 0; i < alvos.length; i++) {
        alvos[i].textContent = apxFavoritos.length;
        if (apxFavoritos.length > 0) {
            alvos[i].classList.add('apx-visivel');
        } else {
            alvos[i].classList.remove('apx-visivel');
        }
    }
}

function apxEhFavorito(id) {
    return apxFavoritos.indexOf(id) !== -1;
}

function apxAlternarFavorito(id) {
    const posicao = apxFavoritos.indexOf(id);

    if (posicao === -1) {
        apxFavoritos.push(id);
    } else {
        apxFavoritos.splice(posicao, 1);
    }

    apxSalvarFavoritos();
    return apxEhFavorito(id);
}

function apxCalcularParcela(preco, entrada, meses) {
    const taxaMensal = 0.0129;
    const valorFinanciado = preco - entrada;

    if (valorFinanciado <= 0) {
        return 0;
    }

    const amortizacao = valorFinanciado / meses;
    let saldo = valorFinanciado;
    let totalJuros = 0;

    for (let i = 0; i < meses; i++) {
        totalJuros = totalJuros + (saldo * taxaMensal);
        saldo = saldo - amortizacao;
    }

    return (valorFinanciado + totalJuros) / meses;
}

function apxMontarCard(carro) {
    const favorito = apxEhFavorito(carro.id) ? ' ativo' : '';
    const rotuloFavorito = apxEhFavorito(carro.id) ? 'Remover da garagem' : 'Salvar na garagem';
    const parcela = apxCalcularParcela(carro.preco, carro.preco * 0.2, 48);
    const classeCondicao = APX_CLASSE_CONDICAO[carro.condicao] || 'apx-fita';

    return '' +
        '<div class="col-md-6 col-lg-4" data-card="' + carro.id + '">' +
            '<article class="apx-card">' +
                '<div class="apx-card__foto">' +
                    '<img src="' + carro.foto + '" alt="' + apxEscapar(carro.marca + ' ' + carro.modelo) + '" width="1200" height="800" loading="lazy">' +
                    '<div class="apx-card__etiquetas">' +
                        '<span class="apx-fita ' + classeCondicao + '">' + APX_ROTULO_CONDICAO[carro.condicao] + '</span>' +
                        (carro.combustivel === 'elétrico' ? '<span class="apx-fita apx-fita--eletrico">Elétrico</span>' : '') +
                    '</div>' +
                '</div>' +
                '<div class="apx-card__corpo">' +
                    '<p class="apx-card__marca">' + apxEscapar(carro.marca) + '</p>' +
                    '<h3 class="apx-card__nome">' + apxEscapar(carro.modelo) + '</h3>' +
                    '<div class="apx-card__ficha">' +
                        '<div>Ano<b>' + carro.ano + '</b></div>' +
                        '<div>Câmbio<b>' + carro.cambio.toUpperCase() + '</b></div>' +
                        '<div>Km<b>' + apxFormatarNumero(carro.km) + '</b></div>' +
                        '<div>Combustível<b>' + carro.combustivel + '</b></div>' +
                    '</div>' +
                    '<p class="apx-card__preco">' + apxFormatarMoeda(carro.preco) + '</p>' +
                    '<p class="apx-card__parcela">ou 48x de ' + apxFormatarMoeda(parcela) + ' com 20% de entrada</p>' +
                    '<div class="apx-card__rodape">' +
                        '<a class="btn-apex btn-apex--peq" href="contato.html?veiculo=' + encodeURIComponent(carro.id) + '">Tenho interesse</a>' +
                        '<button type="button" class="btn-apex btn-apex--vazio btn-apex--peq apx-favorito' + favorito + '" ' +
                            'data-favorito="' + carro.id + '" aria-label="' + rotuloFavorito + '" aria-pressed="' + (favorito ? 'true' : 'false') + '">' +
                            '&#9733; Garagem' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</article>' +
        '</div>';
}

function apxFiltrar() {
    const criterio = APX_CATEGORIAS.filter(function (item) {
        return item.chave === apxFiltroAtual;
    })[0];

    const resultado = [];

    for (let i = 0; i < APX_ESTOQUE.length; i++) {
        const carro = APX_ESTOQUE[i];
        if (criterio && criterio.teste(carro)) {
            resultado.push(carro);
        }
    }

    if (apxOrdenacaoAtual === 'menor-preco') {
        resultado.sort(function (a, b) { return a.preco - b.preco; });
    } else if (apxOrdenacaoAtual === 'maior-preco') {
        resultado.sort(function (a, b) { return b.preco - a.preco; });
    } else if (apxOrdenacaoAtual === 'menor-km') {
        resultado.sort(function (a, b) { return a.km - b.km; });
    } else if (apxOrdenacaoAtual === 'mais-novo') {
        resultado.sort(function (a, b) { return b.ano - a.ano; });
    } else {
        resultado.sort(function (a, b) {
            if (a.destaque && !b.destaque) { return -1; }
            if (!a.destaque && b.destaque) { return 1; }
            return b.preco - a.preco;
        });
    }

    return resultado;
}

function apxRenderizarEstoque() {
    const grade = apxSelecionar('#apx-grade-estoque');
    if (!grade) {
        return;
    }

    const lista = apxFiltrar();
    let html = '';

    for (let i = 0; i < lista.length; i++) {
        html = html + apxMontarCard(lista[i]);
    }

    if (lista.length === 0) {
        html = '<div class="col-12"><div class="apx-painel"><h3>Nenhum veículo encontrado</h3>' +
            '<p class="mb-0">Ajuste os filtros para ver outras opcoes do estoque.</p></div></div>';
    }

    grade.innerHTML = html;

    const contador = apxSelecionar('#apx-contador-estoque');
    if (contador) {
        contador.textContent = lista.length;
    }

    apxAtualizarContadorGaragem();
}


function apxMontarFiltros() {
    const barra = apxSelecionar('#apx-filtros');
    if (!barra) {
        return;
    }

    let html = '';

    for (let i = 0; i < APX_CATEGORIAS.length; i++) {
        const classe = APX_CATEGORIAS[i].chave === apxFiltroAtual ? 'apx-filtro apx-ativo' : 'apx-filtro';
        html = html + '<button type="button" class="' + classe + '" data-filtro="' +
            APX_CATEGORIAS[i].chave + '">' + APX_CATEGORIAS[i].rotulo + '</button>';
    }

    barra.innerHTML = html;

    barra.addEventListener('click', function (evento) {
        const botao = evento.target.closest('[data-filtro]');
        if (!botao) {
            return;
        }

        apxFiltroAtual = botao.dataset.filtro;
        localStorage.setItem(APX_CHAVE_FILTRO, apxFiltroAtual);

        const todos = apxSelecionarTodos('[data-filtro]', barra);
        for (let i = 0; i < todos.length; i++) {
            if (todos[i] === botao) {
                todos[i].classList.add('apx-ativo');
            } else {
                todos[i].classList.remove('apx-ativo');
            }
        }

        apxRenderizarEstoque();
    });
}

function apxDelegarFavoritos() {
    document.addEventListener('click', function (evento) {
        const botao = evento.target.closest('[data-favorito]');
        if (!botao) {
            return;
        }

        const id = botao.dataset.favorito;
        const ativo = apxAlternarFavorito(id);

        if (ativo) {
            botao.classList.add('ativo');
            botao.setAttribute('aria-pressed', 'true');
            botao.setAttribute('aria-label', 'Remover da garagem');
        } else {
            botao.classList.remove('ativo');
            botao.setAttribute('aria-pressed', 'false');
            botao.setAttribute('aria-label', 'Salvar na garagem');
        }

        apxRenderizarGaragem();
    });
}

function apxRenderizarGaragem() {
    const caixa = apxSelecionar('#apx-garagem');
    if (!caixa) {
        return;
    }

    const vazio = apxSelecionar('#apx-garagem-vazio');

    if (apxFavoritos.length === 0) {
        caixa.innerHTML = '';
        if (vazio) {
            vazio.style.display = 'block';
        }
        return;
    }

    if (vazio) {
        vazio.style.display = 'none';
    }

    let html = '';

    for (let i = 0; i < apxFavoritos.length; i++) {
        const carro = APX_ESTOQUE.filter(function (item) {
            return item.id === apxFavoritos[i];
        })[0];

        if (!carro) {
            continue;
        }

        html = html +
            '<div class="apx-painel mb-3">' +
                '<div class="d-flex flex-wrap justify-content-between align-items-center gap-3">' +
                    '<div>' +
                        '<h3 class="mb-1" style="font-size: 1.1rem;">' + apxEscapar(carro.marca + ' ' + carro.modelo) + '</h3>' +
                        '<p class="mb-0" style="font-size: 0.88rem;">' + carro.ano + ' &middot; ' +
                            apxFormatarNumero(carro.km) + ' km &middot; ' + apxFormatarMoeda(carro.preco) + '</p>' +
                    '</div>' +
                    '<div class="d-flex gap-2 flex-wrap">' +
                        '<a class="btn-apex btn-apex--peq" href="contato.html?veiculo=' + encodeURIComponent(carro.id) + '">Falar com consultor</a>' +
                        '<button type="button" class="btn-apex btn-apex--vazio btn-apex--peq" data-favorito="' + carro.id + '">Remover</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    if (html === '') {
        html = '<div class="apx-painel"><p class="mb-0">Os veículos salvos não estão mais no estoque.</p></div>';
    }

    caixa.innerHTML = html;
}

function apxIniciarCalculadora() {
    const formulario = apxSelecionar('#apx-form-financiamento');
    if (!formulario) {
        return;
    }

    const campoVeiculo = apxSelecionar('#fin-veiculo', formulario);
    const campoEntrada = apxSelecionar('#fin-entrada', formulario);
    const campoPrazo = apxSelecionar('#fin-prazo', formulario);
    const saidaParcela = apxSelecionar('#fin-resultado', formulario);
    const saidaDetalhe = apxSelecionar('#fin-detalhe', formulario);

    let opcoes = '';

    for (let i = 0; i < APX_ESTOQUE.length; i++) {
        const carro = APX_ESTOQUE[i];
        opcoes = opcoes + '<option value="' + carro.id + '">' +
            apxEscapar(carro.marca + ' ' + carro.modelo + ' - ' + apxFormatarMoeda(carro.preco)) +
            '</option>';
    }

    campoVeiculo.innerHTML = opcoes;

    function recalcular() {
        const carro = APX_ESTOQUE.filter(function (item) {
            return item.id === campoVeiculo.value;
        })[0];

        if (!carro) {
            return;
        }

        const entrada = Number(campoEntrada.value);
        const meses = Number(campoPrazo.value);

        if (entrada < 0) {
            saidaParcela.textContent = '--';
            saidaDetalhe.textContent = 'A entrada não pode ser negativa.';
            return;
        } else if (entrada >= carro.preco) {
            saidaParcela.textContent = apxFormatarMoeda(0);
            saidaDetalhe.textContent = 'Pagamento a vista, sem financiamento.';
            return;
        }

        const parcela = apxCalcularParcela(carro.preco, entrada, meses);
        const total = parcela * meses + entrada;
        const juros = total - carro.preco;

        saidaParcela.textContent = apxFormatarMoeda(parcela);
        saidaDetalhe.textContent = meses + 'x · total de ' +
            apxFormatarMoeda(total) + ' · juros de ' + apxFormatarMoeda(juros);
    }

    campoVeiculo.addEventListener('change', function () {
        const carro = APX_ESTOQUE.filter(function (item) {
            return item.id === campoVeiculo.value;
        })[0];
        if (carro) {
            campoEntrada.value = Math.round(carro.preco * 0.2);
        }
        recalcular();
    });

    campoEntrada.addEventListener('input', recalcular);
    campoPrazo.addEventListener('change', recalcular);

    campoVeiculo.dispatchEvent(new Event('change'));
}

function apxIniciarComparador() {
    const tabela = apxSelecionar('#apx-tabela-estoque');
    if (!tabela) {
        return;
    }

    const corpo = apxSelecionar('tbody', tabela);
    let html = '';

    const ordenado = APX_ESTOQUE.slice().sort(function (a, b) {
        return a.preco - b.preco;
    });

    for (let i = 0; i < ordenado.length; i++) {
        const carro = ordenado[i];
        const parcela = apxCalcularParcela(carro.preco, carro.preco * 0.2, 48);
        html = html +
            '<tr>' +
                '<td>' + apxEscapar(carro.marca + ' ' + carro.modelo) + '</td>' +
                '<td>' + carro.ano + '</td>' +
                '<td>' + carro.categoria.toUpperCase() + '</td>' +
                '<td>' + apxFormatarNumero(carro.km) + '</td>' +
                '<td>' + carro.combustivel + '</td>' +
                '<td>' + carro.cambio.toUpperCase() + '</td>' +
                '<td class="apx-celula-destaque">' + apxFormatarMoeda(carro.preco) + '</td>' +
                '<td>' + apxFormatarMoeda(parcela) + '</td>' +
            '</tr>';
    }

    corpo.innerHTML = html;

    const total = apxSelecionar('#apx-tabela-total');
    if (total) {
        total.textContent = ordenado.length;
    }
}

function apxIniciarPaginaEstoque() {
    if (!apxSelecionar('#apx-grade-estoque')) {
        return;
    }

    apxCarregarFavoritos();

    const filtroSalvo = localStorage.getItem(APX_CHAVE_FILTRO);
    if (filtroSalvo) {
        const existe = APX_CATEGORIAS.filter(function (item) {
            return item.chave === filtroSalvo;
        });
        if (existe.length > 0) {
            apxFiltroAtual = filtroSalvo;
        }
    }

    apxMontarFiltros();
    apxRenderizarEstoque();
    apxRenderizarGaragem();
    apxDelegarFavoritos();

    const campoOrdenacao = apxSelecionar('#apx-ordenacao');
    if (campoOrdenacao) {
        campoOrdenacao.addEventListener('change', function () {
            apxOrdenacaoAtual = campoOrdenacao.value;
            apxRenderizarEstoque();
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    apxIniciarPaginaEstoque();
    apxIniciarCalculadora();
    apxIniciarComparador();
});
