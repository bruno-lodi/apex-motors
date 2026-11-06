/* ============================================================================
   APEX MOTORS - script principal compartilhado por todas as paginas
   Autores: Bruno Lodi e Pietro Ferreira dos Santos
   Conteudo: estado da navbar, botao de topo, contadores,
   armazenamento local do usuario e validacao do formulario de contato.
   ============================================================================ */
'use strict';

const apxSelecionar = (seletor, pai = document) => pai.querySelector(seletor);
const apxSelecionarTodos = (seletor, pai = document) => Array.from(pai.querySelectorAll(seletor));

const APX_CHAVE_USUARIO = 'apex_usuario';
const APX_CHAVE_VISITAS = 'apex_visitas';
const APX_CHAVE_GARAGEM = 'apex_garagem';
const APX_CHAVE_FILTRO = 'apex_filtro';

function apxLerJson(chave, padrao) {
    try {
        const bruto = localStorage.getItem(chave);
        if (bruto === null) {
            return padrao;
        }
        return JSON.parse(bruto);
    } catch (erro) {
        return padrao;
    }
}

function apxGravarJson(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
        return true;
    } catch (erro) {
        return false;
    }
}

function apxFormatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function apxFormatarNumero(valor) {
    return valor.toLocaleString('pt-BR');
}

function apxEscapar(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function apxContarVisita() {
    let visitas = Number(localStorage.getItem(APX_CHAVE_VISITAS));
    if (isNaN(visitas)) {
        visitas = 0;
    }
    visitas = visitas + 1;
    localStorage.setItem(APX_CHAVE_VISITAS, String(visitas));
    return visitas;
}

function apxIniciarBarra() {
    const barra = apxSelecionar('#apx-barra');
    if (!barra) {
        return;
    }

    function estado() {
        if (window.scrollY > 22) {
            barra.classList.add('apx-rolou');
        } else {
            barra.classList.remove('apx-rolou');
        }
    }

    window.addEventListener('scroll', estado, { passive: true });
    estado();

    const caminho = window.location.pathname.split('/').pop() || 'index.html';
    const links = apxSelecionarTodos('.apx-menu .nav-link');

    for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute('href') === caminho) {
            links[i].classList.add('apx-ativo');
            links[i].setAttribute('aria-current', 'page');
        }
    }
}


function apxIniciarBotaoTopo() {
    const botao = apxSelecionar('#apx-topo-btn');
    if (!botao) {
        return;
    }

    window.addEventListener('scroll', function () {
        if (window.scrollY > 560) {
            botao.classList.add('apx-visivel');
        } else {
            botao.classList.remove('apx-visivel');
        }
    }, { passive: true });

    botao.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function apxIniciarContadores() {
    const alvos = apxSelecionarTodos('[data-contar]');

    for (let i = 0; i < alvos.length; i++) {
        const elemento = alvos[i];
        const final = Number(elemento.dataset.contar);
        const sufixo = elemento.dataset.sufixo || '';
        const passo = Math.ceil(final / 40);
        let atual = 0;

        const contador = setInterval(function () {
            atual = atual + passo;

            if (atual >= final) {
                atual = final;
                clearInterval(contador);
            }

            elemento.textContent = atual + sufixo;
        }, 30);
    }
}

function apxIniciarSaudacao() {
    const alvo = apxSelecionar('#apx-saudacao');
    const visitas = apxContarVisita();

    if (visitas === 1) {
        console.log('Apex Motors: primeira visita registrada neste navegador.');
    }

    if (!alvo) {
        return;
    }

    const dados = apxLerJson(APX_CHAVE_USUARIO, null);

    if (dados && dados.nome) {
        const primeiro = dados.nome.split(' ')[0];
        alvo.textContent = 'Olá, ' + primeiro;
        alvo.classList.add('apx-visivel');
        alvo.setAttribute('title', 'Clique para esquecer meus dados');

        alvo.addEventListener('click', function () {
            localStorage.removeItem(APX_CHAVE_USUARIO);
            alvo.textContent = 'Dados apagados';
            setTimeout(function () {
                alvo.classList.remove('apx-visivel');
            }, 1500);
        });
    }
}

function apxAtualizarAno() {
    const alvos = apxSelecionarTodos('.apx-ano');
    const ano = new Date().getFullYear();
    for (let i = 0; i < alvos.length; i++) {
        alvos[i].textContent = ano;
    }
}

function apxIniciarFormularioContato() {
    const formulario = apxSelecionar('#apx-form-contato');
    if (!formulario) {
        return;
    }

    const campoNome = apxSelecionar('#nome', formulario);
    const campoEmail = apxSelecionar('#email', formulario);
    const campoTelefone = apxSelecionar('#telefone', formulario);
    const campoModelo = apxSelecionar('#modelo', formulario);
    const campoMensagem = apxSelecionar('#mensagem', formulario);
    const campoAceite = apxSelecionar('#aceite', formulario);
    const caixaAlerta = apxSelecionar('#apx-alerta-form', formulario);
    const veiculoDaUrl = new URLSearchParams(window.location.search).get('veiculo');

    if (veiculoDaUrl && campoModelo) {
        campoModelo.value = veiculoDaUrl;
    }

    function marcarErro(campo, mensagem) {
        const bloco = campo.closest('.apx-campo');
        if (!bloco) {
            return;
        }
        bloco.classList.add('apx-campo--erro');
        const aviso = bloco.querySelector('.apx-campo__erro');
        if (aviso) {
            aviso.textContent = mensagem;
        }
    }

    function limparErro(campo) {
        const bloco = campo.closest('.apx-campo');
        if (!bloco) {
            return;
        }
        bloco.classList.remove('apx-campo--erro');
        const aviso = bloco.querySelector('.apx-campo__erro');
        if (aviso) {
            aviso.textContent = '';
        }
    }

    function mostrarAlerta(tipo, conteudo) {
        if (!caixaAlerta) {
            return;
        }
        caixaAlerta.className = 'apx-alerta apx-alerta--' + tipo + ' apx-visivel';
        caixaAlerta.innerHTML = conteudo;
    }

    if (campoTelefone) {
        campoTelefone.addEventListener('input', function () {
            let numeros = campoTelefone.value.replace(/\D/g, '');
            if (numeros.length > 11) {
                numeros = numeros.slice(0, 11);
            }

            if (numeros.length === 0) {
                campoTelefone.value = '';
            } else if (numeros.length <= 2) {
                campoTelefone.value = '(' + numeros;
            } else if (numeros.length <= 6) {
                campoTelefone.value = '(' + numeros.slice(0, 2) + ') ' + numeros.slice(2);
            } else if (numeros.length <= 10) {
                campoTelefone.value = '(' + numeros.slice(0, 2) + ') ' +
                    numeros.slice(2, 6) + '-' + numeros.slice(6);
            } else {
                campoTelefone.value = '(' + numeros.slice(0, 2) + ') ' +
                    numeros.slice(2, 7) + '-' + numeros.slice(7);
            }
        });
    }

    function validarNome() {
        const valor = campoNome.value.trim();
        if (valor === '') {
            marcarErro(campoNome, 'Informe seu nome completo.');
            return false;
        } else if (valor.length < 3) {
            marcarErro(campoNome, 'O nome precisa ter ao menos 3 caracteres.');
            return false;
        } else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(valor)) {
            marcarErro(campoNome, 'Use apenas letras no nome.');
            return false;
        }
        limparErro(campoNome);
        return true;
    }

    function validarEmail() {
        const valor = campoEmail.value.trim();
        const formato = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

        if (valor === '') {
            marcarErro(campoEmail, 'Informe seu e-mail.');
            return false;
        } else if (!formato.test(valor)) {
            marcarErro(campoEmail, 'E-mail inválido. Exemplo: nome@dominio.com');
            return false;
        }
        limparErro(campoEmail);
        return true;
    }

    function validarTelefone() {
        const numeros = campoTelefone.value.replace(/\D/g, '');
        if (numeros === '') {
            marcarErro(campoTelefone, 'Informe um telefone para contato.');
            return false;
        } else if (numeros.length < 10) {
            marcarErro(campoTelefone, 'Telefone incompleto. Use DDD mais o número.');
            return false;
        }
        limparErro(campoTelefone);
        return true;
    }

    function validarModelo() {
        if (campoModelo.value === '') {
            marcarErro(campoModelo, 'Escolha o veículo de interesse.');
            return false;
        }
        limparErro(campoModelo);
        return true;
    }

    function validarMensagem() {
        const valor = campoMensagem.value.trim();
        if (valor === '') {
            marcarErro(campoMensagem, 'Escreva sua mensagem.');
            return false;
        } else if (valor.length < 12) {
            marcarErro(campoMensagem, 'Descreva um pouco mais, minimo de 12 caracteres.');
            return false;
        }
        limparErro(campoMensagem);
        return true;
    }

    function validarAceite() {
        if (!campoAceite.checked) {
            marcarErro(campoAceite, 'É preciso autorizar o contato.');
            return false;
        }
        limparErro(campoAceite);
        return true;
    }

    campoNome.addEventListener('blur', validarNome);
    campoEmail.addEventListener('blur', validarEmail);
    campoTelefone.addEventListener('blur', validarTelefone);
    campoMensagem.addEventListener('blur', validarMensagem);

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        let primeiroErro = null;
        let valido = true;

        if (!validarNome()) {
            valido = false;
            primeiroErro = primeiroErro || campoNome;
        }
        if (!validarEmail()) {
            valido = false;
            primeiroErro = primeiroErro || campoEmail;
        }
        if (!validarTelefone()) {
            valido = false;
            primeiroErro = primeiroErro || campoTelefone;
        }
        if (!validarModelo()) {
            valido = false;
            primeiroErro = primeiroErro || campoModelo;
        }
        if (!validarMensagem()) {
            valido = false;
            primeiroErro = primeiroErro || campoMensagem;
        }
        if (!validarAceite()) {
            valido = false;
            primeiroErro = primeiroErro || campoAceite;
        }

        if (valido === false) {
            mostrarAlerta('erro', '<div><b>Revise os campos destacados.</b> Faltou preencher alguma informação obrigatória.</div>');
            if (primeiroErro) {
                primeiroErro.focus();
                primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        const registro = {
            nome: campoNome.value.trim(),
            email: campoEmail.value.trim(),
            telefone: campoTelefone.value.trim(),
            modelo: campoModelo.options[campoModelo.selectedIndex].text,
            mensagem: campoMensagem.value.trim(),
            data: new Date().toISOString()
        };

        const historico = apxLerJson(APX_CHAVE_USUARIO, null);
        const lista = historico && Array.isArray(historico.contatos) ? historico.contatos : [];
        lista.push(registro);

        apxGravarJson(APX_CHAVE_USUARIO, {
            nome: registro.nome,
            email: registro.email,
            ultimoModelo: registro.modelo,
            contatos: lista
        });

        const primeiroNome = registro.nome.split(' ')[0];

        mostrarAlerta('ok',
            '<div><b>Recebemos seu contato, ' + apxEscapar(primeiroNome) + '.</b><br>' +
            'Você demonstrou interesse no <b>' + apxEscapar(registro.modelo) + '</b>. ' +
            'Um consultor responde em até 1 dia útil no e-mail <b>' + apxEscapar(registro.email) + '</b>.<br>' +
            '<small>Este e um projeto academico: os dados ficaram salvos apenas neste navegador.</small></div>'
        );

        formulario.reset();

        const blocos = apxSelecionarTodos('.apx-campo', formulario);
        for (let i = 0; i < blocos.length; i++) {
            blocos[i].classList.remove('apx-campo--erro');
            const aviso = blocos[i].querySelector('.apx-campo__erro');
            if (aviso) {
                aviso.textContent = '';
            }
        }

        const saudacao = apxSelecionar('#apx-saudacao');
        if (saudacao) {
            saudacao.textContent = 'Olá, ' + primeiroNome;
            saudacao.classList.add('apx-visivel');
        }

        caixaAlerta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

function apxIniciarContatoRapido() {
    const formulario = apxSelecionar('#apx-form-news');
    if (!formulario) {
        return;
    }

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const campo = apxSelecionar('#email-news', formulario);
        const bloco = campo.closest('.apx-campo');
        const aviso = bloco.querySelector('.apx-campo__erro');
        const retorno = apxSelecionar('#apx-retorno-news', formulario);
        const valor = campo.value.trim();
        const formato = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

        if (valor === '') {
            bloco.classList.add('apx-campo--erro');
            aviso.textContent = 'Digite um e-mail.';
            retorno.textContent = '';
            return;
        } else if (!formato.test(valor)) {
            bloco.classList.add('apx-campo--erro');
            aviso.textContent = 'E-mail inválido.';
            retorno.textContent = '';
            return;
        }

        bloco.classList.remove('apx-campo--erro');
        aviso.textContent = '';
        localStorage.setItem('apex_news', valor);
        retorno.textContent = 'Cadastro confirmado: ' + valor;
        formulario.reset();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    apxIniciarBarra();
    apxIniciarBotaoTopo();
    apxIniciarContadores();
    apxIniciarSaudacao();
    apxAtualizarAno();
    apxIniciarFormularioContato();
    apxIniciarContatoRapido();
});
