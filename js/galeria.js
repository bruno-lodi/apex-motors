/* ============================================================================
   APEX MOTORS - galeria da pagina sem Bootstrap (CSS Grid puro)
   Autores: Bruno Lodi e Pietro Ferreira dos Santos
   Conteudo: montagem da galeria por repeticao, filtro por categoria e lightbox
   criada com document.createElement em JavaScript puro.
   ============================================================================ */
'use strict';

const APX_GALERIA = [
    { arquivo: 'img/fiat-toro.jpg', titulo: 'Fiat Toro Freedom', categoria: 'veiculos' },
    { arquivo: 'img/carro-estoque.webp', titulo: 'Showroom principal', categoria: 'showroom' },
    { arquivo: 'img/jeep-compass.jpg', titulo: 'Jeep Compass Longitude', categoria: 'veiculos' },
    { arquivo: 'img/painel-detalhe.webp', titulo: 'Revisão de 120 pontos', categoria: 'servicos' },
    { arquivo: 'img/toyota-corolla.jpg', titulo: 'Toyota Corolla Cross', categoria: 'veiculos' },
    { arquivo: 'img/honda-hrv.jpg', titulo: 'Honda HR-V EXL', categoria: 'veiculos' },
    { arquivo: 'img/apx-dashboard-premium.webp', titulo: 'Checagem eletrônica', categoria: 'servicos' },
    { arquivo: 'img/byd-dolphin.jpg', titulo: 'BYD Dolphin Mini GS', categoria: 'veiculos' },
    { arquivo: 'img/carro-financiamento.webp', titulo: 'Modelo em destaque', categoria: 'showroom' },
    { arquivo: 'img/carro-hero.webp', titulo: 'Área de entrega', categoria: 'showroom' }
];
let apxGaleriaAtual = [];
let apxGaleriaIndice = 0;

function apxDesenharGaleria(lista) {
    const alvo = document.getElementById('apx-galeria-grade');
    if (!alvo) {
        return;
    }

    apxGaleriaAtual = lista;
    let html = '';

    for (let i = 0; i < lista.length; i++) {
        let classeExtra = '';

        if (i === 0) {
            classeExtra = 'apx-g-larga apx-g-alta';
        } else if (i === lista.length - 1 && lista.length > 4) {
            classeExtra = 'apx-g-total';
        } else if (i === lista.length - 1 && lista.length > 2) {
            classeExtra = 'apx-g-larga';
        }

        html = html +
            '<figure class="' + classeExtra + '" data-indice="' + i + '" tabindex="0" ' +
                'role="button" aria-label="Ampliar imagem: ' + apxEscapar(lista[i].titulo) + '">' +
                '<img src="' + lista[i].arquivo + '" alt="' + apxEscapar(lista[i].titulo) + '" ' +
                    'width="700" height="700" loading="lazy">' +
                '<figcaption>' + apxEscapar(lista[i].titulo) + '</figcaption>' +
            '</figure>';
    }

    alvo.innerHTML = html;

    const contador = document.getElementById('apx-galeria-contador');
    if (contador) {
        contador.textContent = lista.length + (lista.length === 1 ? ' foto' : ' fotos');
    }

    apxLigarFiguras();
}

function apxFiltrarGaleria(categoria, botao) {
    const resultado = [];

    for (let i = 0; i < APX_GALERIA.length; i++) {
        if (categoria === 'todas') {
            resultado.push(APX_GALERIA[i]);
        } else if (APX_GALERIA[i].categoria === categoria) {
            resultado.push(APX_GALERIA[i]);
        }
    }

    const botoes = document.querySelectorAll('[data-galeria-filtro]');
    for (let i = 0; i < botoes.length; i++) {
        if (botoes[i] === botao) {
            botoes[i].classList.add('apx-ativo');
        } else {
            botoes[i].classList.remove('apx-ativo');
        }
    }

    apxDesenharGaleria(resultado);
}

function apxCriarLightbox() {
    if (document.getElementById('apx-lightbox')) {
        return;
    }

    const caixa = document.createElement('div');
    caixa.id = 'apx-lightbox';
    caixa.setAttribute('role', 'dialog');
    caixa.setAttribute('aria-modal', 'true');
    caixa.setAttribute('aria-label', 'Imagem ampliada da galeria');
    caixa.style.cssText = 'position:fixed;inset:0;z-index:300;display:none;place-items:center;' +
        'background:rgba(6,8,12,0.95);backdrop-filter:blur(7px);padding:clamp(1rem,4vw,3.5rem);';

    const fechar = document.createElement('button');
    fechar.type = 'button';
    fechar.className = 'apx-lb-fechar';
    fechar.setAttribute('aria-label', 'Fechar imagem');
    fechar.innerHTML = '&times;';
    fechar.style.cssText = 'position:absolute;top:1.1rem;right:1.1rem;width:46px;height:46px;' +
        'border-radius:50%;border:1px solid #3B4855;background:rgba(22,27,37,0.9);color:#F4F6F8;' +
        'font-size:1.8rem;line-height:1;cursor:pointer;display:grid;place-items:center;';

    const anterior = document.createElement('button');
    anterior.type = 'button';
    anterior.className = 'apx-lb-anterior';
    anterior.setAttribute('aria-label', 'Imagem anterior');
    anterior.innerHTML = '&#8249;';
    anterior.style.cssText = 'position:absolute;left:clamp(0.5rem,2vw,2rem);top:50%;transform:translateY(-50%);' +
        'width:46px;height:46px;border-radius:50%;border:1px solid #3B4855;background:rgba(22,27,37,0.9);' +
        'color:#F4F6F8;font-size:1.6rem;cursor:pointer;display:grid;place-items:center;';

    const proxima = document.createElement('button');
    proxima.type = 'button';
    proxima.className = 'apx-lb-proxima';
    proxima.setAttribute('aria-label', 'Proxima imagem');
    proxima.innerHTML = '&#8250;';
    proxima.style.cssText = anterior.style.cssText.replace('left:clamp(0.5rem,2vw,2rem)', 'right:clamp(0.5rem,2vw,2rem)');

    const imagem = document.createElement('img');
    imagem.className = 'apx-lb-imagem';
    imagem.alt = '';
    imagem.style.cssText = 'max-width:min(92vw,1080px);max-height:76vh;width:auto;border-radius:10px;' +
        'border:1px solid #3B4855;box-shadow:0 40px 90px -40px #000;';

    const legenda = document.createElement('p');
    legenda.className = 'apx-lb-legenda';
    legenda.style.cssText = 'margin:0.9rem 0 0;font-size:0.86rem;color:#A9B4C2;text-align:center;';

    caixa.appendChild(imagem);
    caixa.appendChild(legenda);
    caixa.appendChild(fechar);
    caixa.appendChild(anterior);
    caixa.appendChild(proxima);
    document.body.appendChild(caixa);

    fechar.addEventListener('click', apxFecharLightbox);

    anterior.addEventListener('click', function (evento) {
        evento.stopPropagation();
        apxNavegarLightbox(-1);
    });

    proxima.addEventListener('click', function (evento) {
        evento.stopPropagation();
        apxNavegarLightbox(1);
    });

    caixa.addEventListener('click', function (evento) {
        if (evento.target === caixa) {
            apxFecharLightbox();
        }
    });
}

function apxAbrirLightbox(indice) {
    apxCriarLightbox();
    apxGaleriaIndice = indice;
    apxAtualizarLightbox();

    const caixa = document.getElementById('apx-lightbox');
    caixa.style.display = 'grid';
    document.body.style.overflow = 'hidden';
}

function apxFecharLightbox() {
    const caixa = document.getElementById('apx-lightbox');
    if (!caixa) {
        return;
    }
    caixa.style.display = 'none';
    document.body.style.overflow = '';
}

function apxAtualizarLightbox() {
    const caixa = document.getElementById('apx-lightbox');
    if (!caixa) {
        return;
    }

    const item = apxGaleriaAtual[apxGaleriaIndice];
    if (!item) {
        return;
    }

    const imagem = caixa.querySelector('.apx-lb-imagem');
    const legenda = caixa.querySelector('.apx-lb-legenda');

    imagem.src = item.arquivo;
    imagem.alt = item.titulo;
    legenda.textContent = item.titulo + ' — ' + (apxGaleriaIndice + 1) + ' de ' + apxGaleriaAtual.length;
}

function apxNavegarLightbox(passo) {
    apxGaleriaIndice = apxGaleriaIndice + passo;

    if (apxGaleriaIndice < 0) {
        apxGaleriaIndice = apxGaleriaAtual.length - 1;
    } else if (apxGaleriaIndice >= apxGaleriaAtual.length) {
        apxGaleriaIndice = 0;
    }

    apxAtualizarLightbox();
}

function apxLigarFiguras() {
    const alvo = document.getElementById('apx-galeria-grade');
    if (!alvo) {
        return;
    }

    const figuras = alvo.querySelectorAll('figure');

    for (let i = 0; i < figuras.length; i++) {
        figuras[i].addEventListener('click', function () {
            apxAbrirLightbox(Number(this.dataset.indice));
        });

        figuras[i].addEventListener('keydown', function (evento) {
            if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                apxAbrirLightbox(Number(this.dataset.indice));
            }
        });
    }
}

document.addEventListener('keydown', function (evento) {
    const caixa = document.getElementById('apx-lightbox');
    if (!caixa || caixa.style.display !== 'grid') {
        return;
    }

    if (evento.key === 'Escape') {
        apxFecharLightbox();
    } else if (evento.key === 'ArrowLeft') {
        apxNavegarLightbox(-1);
    } else if (evento.key === 'ArrowRight') {
        apxNavegarLightbox(1);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const alvo = document.getElementById('apx-galeria-grade');
    if (!alvo) {
        return;
    }

    apxDesenharGaleria(APX_GALERIA);

    const botoes = document.querySelectorAll('[data-galeria-filtro]');
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].addEventListener('click', function () {
            apxFiltrarGaleria(this.dataset.galeriaFiltro, this);
        });
    }
});
