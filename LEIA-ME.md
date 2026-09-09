# Storm All Star — site institucional

Site de página única para a equipe de cheerleading **Storm All Star**
(@stormallstar), de Guarapuava — PR. **HTML + CSS + JavaScript puro**, sem
build, sem npm, sem framework.

```
esporte/STORM/
├── index.html                ← todo o conteúdo da página
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/styles.css        ← tema, layout e animações
    ├── js/app.js             ← menu, scroll, grade do Instagram
    ├── js/posts.js           ← ★ os 30 posts reais do @stormallstar (dados)
    └── img/
        ├── logo-storm.jpg    ← escudo oficial (foto de perfil do Instagram)
        ├── og-cover.jpg      ← imagem de compartilhamento (1200×630)
        ├── partner-cdc.jpg   ← logo da Companhia do Corpo
        ├── hero*.jpg         ← fotos de competição em alta resolução
        └── posts/            ← 30 miniaturas das publicações do Instagram
```

> **Este site não segue o modelo genérico** de `restaurante/` e `comercio/`.
> Foi desenhado sob medida, com a identidade da própria Storm: preto,
> turquesa do uniforme e o raio no lugar do **S**.

## Visualizar

Dois cliques em `index.html`. Funciona direto no navegador.

Para servir localmente:

```bash
cd esporte/STORM
python -m http.server 8765     # ou: npx serve .
```

## A ordem das seções (e por quê)

A página é toda sobre a equipe: quem é, de onde veio, com quem treina e o que
já ganhou. Sem seção explicando o esporte.

| # | Seção | O que tem |
|---|---|---|
| — | Herói | Wordmark com o raio, frase-síntese, CTA de WhatsApp |
| — | Faixa de parceiro | Companhia do Corpo em destaque, logo abaixo do herói |
| 01 | A Storm | Quem é a equipe, o raio no lugar do S, valores e números |
| 02 | Nossa história | Linha do tempo clicável: 4 anos, cada um abre um popup |
| 03 | Parceiros | Companhia do Corpo + convite a novos patrocinadores |
| 04 | Campeonatos | Os dois campeonatos disputados, com logo e resultado, + temporadas |
| 05 | Instagram | 30 publicações reais; clicar abre o post original |
| 06 | Faça parte | WhatsApp e Instagram, com dados de inscrição |

**Havia uma seção "O esporte"** — o que é cheerleading, os cinco elementos,
funções, divisões e a história do esporte de 1898 até os World Games. Foi
removida a pedido do cliente: era um terço do texto do site e não é o que vende
a equipe. O site passou de 2.212 para **1.172 palavras** (11 para 6 minutos de
leitura). Se um dia fizer falta, o histórico do git tem a seção inteira, com
o CSS que a acompanhava (`.split`, `.cards`, `.dual`, `.deflist`, `.timeline`).

> A contrapartida: quem nunca viu cheerleading não encontra mais no site o que
> o esporte é. Vale ficar de olho se aparecer essa dúvida no WhatsApp.

## Os fatos do time (todos verificáveis)

Estes números aparecem em várias seções. **Não invente novos** — se precisar
de dado novo, confirme com a equipe ou tire de uma publicação do perfil.

- Grupo formado em **2022–2023**, em equipes universitárias de Guarapuava,
  sem foco em competição
- **Storm All Star fundada em 2024**, já com o objetivo de competir
- **Campeonato Paranaense 2024 (APC)** — **campeã de Team Cheer N2 Coed NT All Star**
  e **ouro no Group Stunt N2 Coed**
- **Arena Legacy 2025**, Curitiba, 11 de outubro — este é o **campeonato
  nacional**: **vice-campeã**, com prata em Group Stunt Coed N2 e prata em
  Group Stunt Coed N3
- **Olimpíadas dos Grupos Escoteiros**, abril de 2026 — apresentação, **não
  foi competição**: aparece na linha do tempo de 2026, não na seção Campeonatos
- **Temporada 2026**: elenco fechado, com competição ainda pela frente
- **Temporada 2027**: try out em breve
- Parceira oficial desde 2025: academia **Companhia do Corpo**

## Onde editar cada coisa

**Textos, campeonatos, parceiro, contato** → direto no `index.html`.
Cada seção é um `<section>` comentado, na ordem em que aparece.

**Contato** — o número aparece em 9 lugares (inclui os dois botões do
cabeçalho, "Quero treinar" e "Quero ser parceiro"). Para trocar tudo de uma vez:

```bash
# do WhatsApp (formato do link)
sed -i 's/5542984119244/55DDDNUMERO/g' index.html
# do número exibido na tela
sed -i 's/+55 42 98411-9244/+55 DD NNNNN-NNNN/g' index.html
```

**Publicações do Instagram** → `assets/js/posts.js`. É um array de objetos:

```js
{
  "code": "DXpTMXQlYYI",              // shortcode do post — monta o link
  "tipo": "foto",                     // "foto" ou "reel" (muda o selo de play)
  "data": "27 abr 2026",
  "iso":  "2026-04-27",               // usado só para ordenar
  "likes": 55,
  "comentarios": 3,
  "texto": "Amar um esporte é ...",   // legenda, sem as hashtags
  "tags":  ["#cheerleading"],
  "img":   "assets/img/posts/DXpTMXQlYYI.jpg"
}
```

Cada bloco da grade é um link direto para
`instagram.com/p/CODE/` (ou `/reel/CODE/` quando `tipo` é `reel`).
Para adicionar um post: salve a imagem em `assets/img/posts/`, copie um bloco,
troque os campos e coloque no topo do array.

**Cores e fontes** → topo do `styles.css`, no bloco `:root`:

```css
--ink:  #0B0C0E;   /* preto tempestade — fundo               */
--bolt: #2FD9C8;   /* turquesa do uniforme — cor de destaque */
--paper:#EFF1F0;   /* texto claro                            */
```

Tipografia: **Anton** nos títulos, **Inter** no texto corrido e
**Space Mono** nos rótulos. Carregadas do Google Fonts, com fallback de
sistema se o site abrir offline.

> O Anton é bem fechado no entrelinhamento. As regras de `line-height` já
> foram afrouxadas para os acentos do português (Ó, Ã, Ê) não encostarem na
> linha de cima — se mexer no tamanho dos títulos, confira isso.

## A linha do tempo clicável

"Nossa história" são **quatro cartões de ano** (2022–23, 2024, 2025, 2026). Cada
um abre um popup do próprio site com o que aconteceu naquele ano.

O texto de cada ano **não vive dentro do JavaScript**: fica no HTML, num
`<div class="anos-fonte" hidden>` no fim da seção. O `app.js` clona o `<article>`
correspondente para dentro do modal quando o ano é clicado. Assim há uma cópia
só do conteúdo, e ela continua no código-fonte da página para o Google ler.

Para **acrescentar um ano**:

1. um `<li>` com o botão na `<ol class="linha">`, com `data-ano="ano-2027"`;
2. um `<article id="ano-2027" data-rotulo="2027">` dentro de `.anos-fonte`.

O `data-rotulo` é o que aparece grande no topo do popup. A navegação
"ano anterior / próximo ano" segue a ordem dos botões, e os extremos
desabilitam sozinhos.

Teclado: `Esc` fecha, `←` e `→` trocam de ano, e o foco volta para o cartão
do ano ao fechar.

### Cuidado com `max-height` em imagem

As fotos dentro do popup usam `width:auto; height:auto; max-width:100%;
max-height:min(340px,46vh)`. **O `height:auto` não é opcional**: sem ele, o
atributo `height` do HTML vale como altura fixa, e aí `max-width` e `max-height`
se aplicam em separado — a imagem é esmagada para caber nos dois limites ao
mesmo tempo. Foi o que acontecia no celular, com até 47% de deformação nas
fotos horizontais. A mesma regra vale para `.champ__logo img`.

A capa de cada cartão usa `object-fit:cover` numa moldura 3:2 — por isso as
fotos de capa são as **paisagens** do acervo (`stunt-paranaense`,
`medalhas-legacy`, `escoteiros`), que perdem pouco nas laterais. Se trocar por
uma foto vertical, ela vai ser cortada com força.

## Logos dos campeonatos

`camp-paranaense-logo.png` e `camp-legacy-logo.png` saíram dos arquivos que o
cliente mandou com fundo removido. O da Legacy vinha com o fundo apenas
*meio* transparente (alfa 128 em toda a volta, que apareceria como um quadrado
avermelhado no fundo escuro) — o alfa foi remapeado para zerar o fundo sem
serrilhar a borda do escudo.

Cards sem logo (Escoteiros e as temporadas) levam uma
`<figure class="champ__logo">` vazia, só para os títulos alinharem na grade.

## Sobre as imagens

Duas origens, com qualidades diferentes:

**Fotos da equipe** — quase todas as imagens vieram dos arquivos originais
enviados pela Storm, em alta resolução: `hero.jpg`, `hero-mobile.jpg`,
`equipe-tablado.jpg`, `stunt-legacy.jpg`, `medalhas-legacy.jpg`,
`equipe-medalhas.jpg`, `trofeu-paranaense.jpg`, `stunt-paranaense.jpg`, `uniforme.jpg`, `escoteiros.jpg`, `camp-luiza.jpg` e
`camp-satori.jpg`. São elas que carregam o site.

As únicas imagens vindas do Instagram são as miniaturas da grade em `posts/`,
onde a resolução máxima pública é **640 px** — tamanho suficiente para o que
elas são: miniaturas de publicação. Elas aparecem em **colunas em cascata**,
cada uma na proporção original do post (quadrada, 4:5 ou vertical de reel),
como no próprio Instagram. Os campos `w` e `h` de cada item em `posts.js`
existem só para o navegador reservar a altura antes da imagem carregar — se
trocar uma miniatura, atualize-os.

O primeiro bloco da linha do tempo (2022–2023) **não tem foto de propósito**:
não existe registro daquela época nos arquivos da equipe, e encher o espaço com
uma imagem de outro ano seria mentir a data. Ele usa o estilo `.story__intro`,
em forma de epígrafe. Se a equipe encontrar uma foto do período, dá para
devolvê-lo ao formato dos demais (`.story__item` com `.story__media`).

Regras de enquadramento adotadas:

- **Nenhuma pessoa é cortada.** Na linha do tempo as molduras têm altura fixa
  de 430 px e a imagem usa `object-fit:contain` — ela encolhe para caber, nunca
  é recortada. Nos outros blocos a moldura usa a **proporção exata do arquivo**
  (`aspect-ratio`) ou deixa a altura livre. Se trocar uma imagem, ajuste junto.
- Todo `<img>` tem `width` e `height` no HTML. Isso reserva o espaço antes do
  carregamento e evita que a página "pule" — mantenha ao substituir arquivos.
- As miniaturas de vídeo do Instagram vêm com o botão de play sobreposto no
  centro. Na grade do Instagram isso é intencional — marca o que é reel.
- Cada foto aparece **uma vez só** no site. A exceção é a do herói, reaproveitada
  no fundo da seção final como fecho.

Se a equipe passar mais originais, é só substituir mantendo os nomes — e
atualizar `width`/`height` no HTML e o `aspect-ratio` no CSS.

## Antes de publicar

- [ ] Trocar `stormallstar.com.br` pelo domínio real em `index.html`
      (canonical + Open Graph), `robots.txt` e `sitemap.xml`
- [ ] Confirmar a próxima competição de 2026 e atualizar o card da temporada
- [ ] Confirmar a lista de parceiros e patrocinadores
- [ ] Testar em celular de verdade

## Publicar

São arquivos estáticos — funciona em qualquer hospedagem. Envie o **conteúdo**
da pasta `STORM/` (não a pasta `esporte/` inteira):

| Onde | Como |
|---|---|
| **Netlify** | Arraste a pasta para app.netlify.com/drop |
| **Vercel** | `npx vercel --prod` dentro da pasta |
| **GitHub Pages** | Suba num repositório e ative Pages |
| **Hostinger / cPanel** | Envie o conteúdo para `public_html/` |

## Acessibilidade e desempenho

- Navegação por teclado em toda a página; `Esc` fecha o menu mobile
- Link "pular para o conteúdo", `aria-*` nos controles e foco visível
- `prefers-reduced-motion` desliga as animações
- Imagens com `loading="lazy"` (exceto a do herói) e dimensões declaradas —
  zero deslocamento de layout medido
- Dados estruturados `SportsTeam` (Schema.org) para o Google
- Peso total: cerca de 3 MB, quase tudo imagem
