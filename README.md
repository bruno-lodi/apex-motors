# Apex Motors — Site institucional de concessionária

Projeto da disciplina **Desenvolvimento Front-End para Web** (Universidade Positivo).
Site responsivo de 11 páginas, com Bootstrap local, 2 páginas sem framework e JavaScript puro.

**Autores:** Bruno Lodi e Pietro Ferreira dos Santos

---

## Como abrir

### Opção 1 — Duplo clique (mais simples)

1. Extraia a pasta `ApexMotors`
2. Dê duplo clique em `index.html`

Funciona direto, sem instalar nada e **sem internet**. Testado: imagens, vídeo, áudio, `localStorage`, fontes e todo o JavaScript funcionam por `file://`.

### Opção 2 — VS Code + Live Server (para apresentar)

1. Abra a pasta no VS Code
2. Instale a extensão **Live Server**
3. Botão direito em `index.html` → **Open with Live Server**

> O site roda 100% offline: Bootstrap, fontes, imagens, vídeo e áudio estão todos dentro da pasta.

---

## Estrutura de pastas

```text
ApexMotors/
│
├── index.html              Home (destaques, vídeo e áudio)
├── estoque.html            Estoque com filtro, ordenação e garagem
├── financiamento.html      Simulador de parcela por amortização
├── servicos.html           Serviços, planos, áudio e vídeo
├── sobre.html              História, valores e linha do tempo
├── equipe.html             Seis perfis da equipe
├── contato.html            Formulário com validação e localStorage
├── comparativo.html        Tabela com os 10 veículos
├── blog.html               Artigos e newsletter
│
├── galeria-grid.html       ★ SEM Bootstrap — CSS Grid puro + lightbox
├── galeria-flex.html       ★ SEM Bootstrap — Flexbox + laboratório
│
├── css/
│   ├── apex.css            Folha principal
│   ├── fonts.css           @font-face das fontes locais
│   └── bootstrap.min.css   Bootstrap 5.3.3 (local)
│
├── js/
│   ├── apex.js             Navbar, contadores, validação, localStorage
│   ├── estoque.js          Array, filtro, ordenação, garagem, financiamento
│   ├── galeria.js          Galeria + lightbox por createElement
│   ├── laboratorio.js      Laboratório Flexbox + configurador
│   └── bootstrap.bundle.min.js
│
├── img/                    48 arquivos de imagem
├── video/                  showroom.mp4, showroom.webm, trilha-apex.mp3
├── fonts/                  5 arquivos WOFF2 (Barlow + Barlow Condensed)
└── doc/                    Documentação em DOCX e PDF
```

---

## Os 20 requisitos — onde está cada um

| # | Requisito | Onde verificar |
|---|---|---|
| 1 | Pasta raiz organizada com nomenclatura adequada | `css/`, `js/`, `img/`, `video/`, `fonts/`, `doc/` |
| 2 | HTML5 semântico | Todas as páginas: `header`, `nav`, `main`, `section`, `article`, `figure`, `footer` |
| 3 | CSS com seletor TAG, CLASSE e ID + 3 escopos | `css/apex.css`; escopo incorporado em `galeria-grid.html` e `galeria-flex.html`; escopo em linha em vários elementos |
| 4 | HTML/CSS/JS puros em 2 páginas | `galeria-grid.html` e `galeria-flex.html` |
| 5 | Menu com links internos **e externos**, com hover | Menu "Mais" → Fiat Brasil, Jeep Brasil, Toyota Brasil; footer → Tabela FIPE, Banco Central |
| 6 | Navbar + container responsivo + rodapé em todas | Todas as 11 páginas |
| 7 | Player de vídeo e reprodutor de áudio nativos | `index.html` e `servicos.html` (`<video controls>` + `<audio controls>`) |
| 8 | CSS Grid Layout | `galeria-grid.html` (`.galeria-pagina`) e `.apx-grid-grade` |
| 9 | CSS Flexbox | `galeria-flex.html`, `.apx-nav-pura`, `.configurador`, `.linha-flex` |
| 10 | Colunas tipo cartão (título, imagem, texto, link) | Cartões de veículo em `index.html` e `estoque.html` |
| 11 | Responsivo para smartphone e desktop | Testado em 320, 390, 768 e 1440 px |
| 12 | Tabela mínima 4×4 com títulos de coluna | `comparativo.html` (8 col × 10 linhas), `servicos.html` (6×4), `blog.html` (5×6) |
| 13 | Formulário com text, email, select, submit, textarea | `contato.html` |
| 14 | Validações `required`, `minlength`, `pattern`, `placeholder` | `contato.html` |
| 15 | Estados `:focus`, `:hover`, `:invalid` estilizados | `css/apex.css` — seção de formulário |
| 16 | Classes utilitárias do Bootstrap | `d-flex`, `mb-3`, `mt-4`, `g-4`, `h-100`, `text-center`, `row`, `col-lg-4` |
| 17 | Eventos JS manipulando o DOM | Filtros, ordenação, calculadora, lightbox, configurador |
| 18 | 4 estruturas: sequencial, condicional, repetição, dados | Ver tabela abaixo |
| 19 | `localStorage` para dados do usuário | Garagem, filtro, cadastro do formulário, configuração do veículo |
| 20 | GitHub público | https://github.com/bruno-lodi/apex-motors |

### As 4 estruturas de programação

| Estrutura | Arquivo | Função |
|---|---|---|
| **Sequencial** | `js/apex.js` | `apxIniciarFormularioContato` — valida, grava, exibe |
| **Condicional** | `js/apex.js` | `validarEmail` — `if / else if / else` |
| **Repetição** | `js/estoque.js` | `apxFiltrar` — `for` percorrendo `APX_ESTOQUE` |
| **Dados** | `js/estoque.js` | Array `APX_ESTOQUE` com 10 objetos de 13 propriedades |

---

## Regras do professor — pontos de atenção atendidos

**Comentários apenas no cabeçalho do arquivo.**
Cada arquivo `.html`, `.css` e `.js` tem um único bloco de comentário nas primeiras linhas. Não há comentários ao longo do código.

**Roda offline a partir do `index.html`.**
Nenhuma referência a CDN. Bootstrap, fontes, imagens, vídeo e áudio estão na pasta.

**Todos os HTML na raiz, documentação em `doc/`.**
Conforme a seção "Como entregar o projeto".

---

## Créditos das imagens

As fotografias dos veículos vêm do **Wikimedia Commons**, sob licenças Creative Commons (CC BY, CC BY-SA) que permitem uso educacional com atribuição.

| Arquivo | Licença |
|---|---|
| fiat-toro.jpg | CC BY-SA 4.0 |
| jeep-compass.jpg | CC BY-SA 2.0 |
| toyota-corolla.jpg | CC BY-SA 4.0 |
| honda-hrv.jpg | CC BY-SA 4.0 |
| vw-tcross.jpg | CC BY-SA 4.0 |
| hyundai-creta.jpg | CC BY-SA 2.0 |
| chevrolet-onix.jpg | CC BY-SA 2.0 |
| nissan-kicks.jpg | CC BY-SA 4.0 |
| byd-dolphin.jpg | CC BY 4.0 |
| citroen-c4.jpg | CC BY-SA 4.0 |

Banners, imagens ilustrativas da equipe e do blog e composições visuais foram **produzidos para este projeto**. O vídeo do showroom e a trilha sonora também foram gerados para o trabalho.

---

## Compatibilidade testada

- **Chrome / Edge** — completo
- **Firefox** — completo
- Abre por **duplo clique** (`file://`) e por **servidor local** (`http://`)

Verificações automáticas executadas:
- 11 páginas sem erro de JavaScript no console
- 11 páginas × 4 larguras (320, 390, 768, 1440 px) sem rolagem horizontal
- Testes de interação (filtros, ordenação, garagem persistente, validação, máscara de telefone, lightbox com teclado, calculadora, laboratório Flexbox)
- Vídeo (1280×720) e áudio (36 s) carregando por `file://`
