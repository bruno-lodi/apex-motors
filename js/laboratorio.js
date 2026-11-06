/* ============================================================================
   APEX MOTORS - laboratorio de Flexbox da pagina sem Bootstrap
   Autores: Bruno Lodi e Pietro Ferreira dos Santos
   Conteudo: aplicacao dinamica de propriedades do Flexbox e simulacao de
   configuracao de veiculo com gravacao no armazenamento local.
   ============================================================================ */
'use strict';

(function () {
    const palco = document.getElementById('apx-palco');
    const linhas = {
        justificar: document.getElementById('apx-linha-justify'),
        alinhar: document.getElementById('apx-linha-align'),
        direcao: document.getElementById('apx-linha-direction'),
        quebra: document.getElementById('apx-linha-wrap')
    };

    const estado = {
        'justify-content': 'flex-start',
        'align-items': 'stretch',
        'flex-direction': 'row',
        'flex-wrap': 'wrap'
    };

    function escreverLinhas() {
        if (linhas.justificar) {
            linhas.justificar.innerHTML = 'justify-content: <b>' + estado['justify-content'] + '</b>;';
        }
        if (linhas.alinhar) {
            linhas.alinhar.innerHTML = 'align-items: <b>' + estado['align-items'] + '</b>;';
        }
        if (linhas.direcao) {
            linhas.direcao.innerHTML = 'flex-direction: <b>' + estado['flex-direction'] + '</b>;';
        }
        if (linhas.quebra) {
            linhas.quebra.innerHTML = 'flex-wrap: <b>' + estado['flex-wrap'] + '</b>;';
        }
    }

    function aplicar() {
        if (!palco) {
            return;
        }
        palco.style.justifyContent = estado['justify-content'];
        palco.style.alignItems = estado['align-items'];
        palco.style.flexDirection = estado['flex-direction'];
        palco.style.flexWrap = estado['flex-wrap'];
        escreverLinhas();
    }

    function ligarControles() {
        const botoes = document.querySelectorAll('[data-flex]');

        for (let i = 0; i < botoes.length; i++) {
            botoes[i].addEventListener('click', function () {
                const propriedade = this.dataset.flex;
                const valor = this.dataset.valor;

                estado[propriedade] = valor;

                for (let j = 0; j < botoes.length; j++) {
                    if (botoes[j].dataset.flex === propriedade) {
                        if (botoes[j] === this) {
                            botoes[j].classList.add('apx-ativo');
                        } else {
                            botoes[j].classList.remove('apx-ativo');
                        }
                    }
                }

                aplicar();
            });
        }

        aplicar();
    }

    const CORES = ['Vermelho Rubi', 'Azul Cobalto', 'Cinza Titânio', 'Preto Ônix', 'Branco Geada'];
    const RODAS = ['Aro 17', 'Aro 18', 'Aro 19'];
    const PACOTES = [
        { nome: 'Tech', valor: 4200 },
        { nome: 'Confort', valor: 3800 },
        { nome: 'Premium', valor: 7900 }
    ];

    function iniciarConfigurador() {
        const seletorCor = document.getElementById('cfg-cor');
        const seletorRoda = document.getElementById('cfg-roda');
        const caixaPacotes = document.getElementById('cfg-pacotes');
        const resumo = document.getElementById('cfg-resumo');
        const botao = document.getElementById('cfg-salvar');
        const retorno = document.getElementById('cfg-retorno');

        if (!seletorCor || !seletorRoda || !resumo) {
            return;
        }

        let htmlCores = '';
        for (let i = 0; i < CORES.length; i++) {
            htmlCores = htmlCores + '<option value="' + CORES[i] + '">' + CORES[i] + '</option>';
        }
        seletorCor.innerHTML = htmlCores;

        let htmlRodas = '';
        for (let i = 0; i < RODAS.length; i++) {
            htmlRodas = htmlRodas + '<option value="' + RODAS[i] + '">' + RODAS[i] + '</option>';
        }
        seletorRoda.innerHTML = htmlRodas;

        if (caixaPacotes) {
            let htmlPacotes = '';
            for (let i = 0; i < PACOTES.length; i++) {
                htmlPacotes = htmlPacotes +
                    '<div class="form-check mb-2">' +
                        '<input class="form-check-input" type="checkbox" value="' + PACOTES[i].nome + '" ' +
                            'id="pacote-' + i + '" data-valor="' + PACOTES[i].valor + '">' +
                        '<label class="form-check-label" for="pacote-' + i + '" style="font-size:0.9rem;">' +
                            PACOTES[i].nome + ' (+ R$ ' + PACOTES[i].valor.toLocaleString('pt-BR') + ')' +
                        '</label>' +
                    '</div>';
            }
            caixaPacotes.innerHTML = htmlPacotes;
        }

        const base = 149900;

        function atualizar() {
            const marcados = document.querySelectorAll('#cfg-pacotes input:checked');
            let extra = 0;
            let nomes = [];

            for (let i = 0; i < marcados.length; i++) {
                extra = extra + Number(marcados[i].dataset.valor);
                nomes.push(marcados[i].value);
            }

            const total = base + extra;

            resumo.innerHTML =
                '<p class="mb-1" style="font-size:0.9rem;">Cor: <strong>' + seletorCor.value + '</strong></p>' +
                '<p class="mb-1" style="font-size:0.9rem;">Rodas: <strong>' + seletorRoda.value + '</strong></p>' +
                '<p class="mb-2" style="font-size:0.9rem;">Pacotes: <strong>' +
                    (nomes.length === 0 ? 'nenhum' : nomes.join(', ')) + '</strong></p>' +
                '<p class="apx-card__preco mb-0">R$ ' + total.toLocaleString('pt-BR') + '</p>';
        }

        seletorCor.addEventListener('change', atualizar);
        seletorRoda.addEventListener('change', atualizar);

        if (caixaPacotes) {
            caixaPacotes.addEventListener('change', atualizar);
        }

        if (botao) {
            botao.addEventListener('click', function () {
                const marcados = document.querySelectorAll('#cfg-pacotes input:checked');
                let nomes = [];
                for (let i = 0; i < marcados.length; i++) {
                    nomes.push(marcados[i].value);
                }

                const configuracao = {
                    cor: seletorCor.value,
                    rodas: seletorRoda.value,
                    pacotes: nomes,
                    data: new Date().toISOString()
                };

                const lista = apxLerJson('apex_configuracoes', []);
                lista.push(configuracao);
                apxGravarJson('apex_configuracoes', lista);

                if (retorno) {
                    retorno.textContent = 'Configuração salva neste navegador (' + lista.length + ' no total).';
                }
            });
        }

        atualizar();
    }

    document.addEventListener('DOMContentLoaded', function () {
        ligarControles();
        iniciarConfigurador();
    });
})();
