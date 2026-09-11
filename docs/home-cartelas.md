# A home, cartela por cartela

A home (`app/page.tsx`, ~7.900 linhas) é **escrita à mão**. Nada nela vem do
banco: nem os filmes em destaque, nem as fichas técnicas, nem as imagens. Toda
alteração de conteúdo aqui é commit e deploy.

Isto está registrado porque **é dívida assumida, não descuido**. Em 10/09/2026 a
decisão foi chumbar as alterações pedidas pela cliente para entregar antes do
anúncio do Oscar (16/09) e migrar para o CMS numa segunda etapa. A pergunta dela
no documento de ajustes foi literalmente *"como altero as informações dessa
cartela?"* — enquanto esta página existir assim, a resposta é "não altera, pede
para o desenvolvedor".

## De onde vem "cartela"

É o vocabulário da cliente no documento **MOVEO FILMES - alterações SITE**
(Google Docs `1HuVC-K08hdBi38nNFsOlG8f9vKrx5ydjHocvd9vHw_k`). Cada cartela é uma
seção da rolagem, identificada lá por um print. O código não usa esse nome — usa
`<section>` com comentários próprios. O mapa abaixo liga os dois.

Os prints do documento foram extraídos para conferência (o `.docx` exportado
guarda as imagens em `word/media/`, na ordem do corpo). Sem eles o mapa é
adivinhação: a numeração dela não bate com a ordem dos `<section>`, porque uma
cartela pode cobrir mais de um painel.

## O mapa

Ancorado pelos comentários JSX, **não** por número de linha — linha muda a cada
edição.

| Cartela | Onde no código (comentário JSX) | O que é |
|---|---|---|
| 01 | primeiro `<section>` do arquivo, `Section index 01` | Abertura / hero — a caixa de vídeo mostra A Natureza (teaser, título, láureas) desde 10/09/2026 |
| 02 | segundo `<section>` | "Sobre a Moveo" — grade com os filmes prontos que a cliente escolheu (desde 10/09/2026) |
| 03 | terceiro `<section>` | Destaques de A Natureza, As Miçangas, Três e Lubrina + frase de posicionamento |
| 04 | `Seção de Transição - Introdução ao Catálogo`, `Section index 04` | Cartão "CATÁLOGO EM DESTAQUE" |
| 05 | `Seção 1 - … Title Only` e `Seção 2 - … Editorial Split` | Vídeo com o título e o painel "O filme". O print da cliente pega a trilha no meio da transição entre os dois |
| 06 | `Seção 3 - … Full Background` | 75ª Berlinale, festivais, prêmios e os links pedidos |
| 07 | `Seção 4 - … Split with Sinopse and Distribution` | Distribuição e ficha técnica |
| 08 | `NÃO HÁ MAGIA — cartela 08`, logo antes de `Transition: Natureza → Miçangas` | **Não Há Magia** desde 10/09/2026: still grande, faixa de stills, ficha e sinopse. Painel sem GSAP. O teaser vai na transição de ripas diagonais logo depois |
| 09 | `AS MIÇANGAS - Panel 0: Film Strip Reveal` e `Panel 1: O filme — stills e sinopse` | Título sobre o trailer; depois a grade com os cinco stills da produção (`STILLS_MICANGAS`, o do rio que a cliente indicou incluído) e a sinopse e a ficha numa coluna de fundo liso |
| 10 | `AS MIÇANGAS - Panel 2: Full-Bleed Credits` | Faixa de láureas (`LAUREAS_MICANGAS`), os 11 festivais em texto e os créditos |
| 11 | `TRÊS - Panel 0: Venetian Blind Reveal` | **Três** desde 10/09/2026 — era O Mistério da Carne |
| 12 | `TRÊS - Panel 1`, `Panel 2` e `Panel 3` | **Três**: circulação, ficha e mosaico de fotos de divulgação |
| 13 | ~~`Finale: End of showcase`~~ | **removida** em 10/09/2026, a pedido da cliente |
| 14 | `Seção - ARQUIVO MOVEL` | "ALÉM DOS FILMES" — a coluna de vídeo e as três imagens são avisos até chegar o material do doc CATÁLOGO |
| 15 | `Seção - NOTÍCIAS` | Notícias — links para o Instagram e o Vimeo (`REDES_MOVEO`, repetidos nos botões do Contato) desde 10/09/2026 |
| 16 | `Seção - CONTATO / FOOTER` (não é `<section>`, é `<div>`) | Contato — a coluna da direita é a animação da logo (`/videos/logo-moveo.mp4`) desde 10/09/2026; antes era a `capahome.png` |

Entre 08/09 e entre 10/11 existem `<section>` de transição (`Transition:
Natureza → Miçangas`, `Transition: Miçangas → Mistério`) que não são cartelas —
são passagens animadas. Mexer nos filmes em destaque mexe nelas também. A de Natureza → Miçangas
vem depois de Não Há Magia e é o lugar do teaser dele.

## Armadilhas desta página

**Os vídeos não têm `src`.** Cada `<video>` leva `preload="none"` e `data-src`;
quem carrega e dá play é o `IntersectionObserver` do `useVideoLazyLoad`, quando
o elemento chega a meia tela. Foi assim que se resolveu o travamento que a
cliente reportou — havia 26 `<video autoPlay>` com `<source src>` baixando e
decodificando ao mesmo tempo no parse. **Não devolva `autoPlay` nem `<source>`
para esta página.**

**Trocar o filme de um bloco é mais do que trocar o texto.** Foi o que a troca
de O Mistério da Carne por Três (cartelas 11 e 12) exigiu:

- o vídeo nos três painéis **e** na prévia da transição que chega neles;
- 22 atributos `data-misterio-*`, que o GSAP usa como seletor — renomeados
  para `data-tres-*` nos dois lados de uma vez;
- os valores de `data-video-parallax` e `data-movie-transition`;
- o selo de festival do painel 1, que era desenhado em cima do Sundance;
- a ficha, a circulação e as chaves de i18n, que ficaram órfãs e saíram.

**Os nomes dos arquivos de vídeo mentem.** Conferido quadro a quadro contra os
stills de cada filme, em 10/09/2026:

| Arquivo | O que é de verdade | Onde fica |
|---|---|---|
| `misterio.mp4` | Lubrina (a moça na porta, o homem com a enxada) | fora da home desde 11/09/2026 (era a coluna de vídeo da cartela 14, no lugar do material de mostras); segue em `/em-breve` |
| `micangas.mp4` | retratos de moradores, material da Lubrina | retângulo decorativo na seção de catálogo |
| `natureza.mp4` | As Miçangas (termina no crédito de direção de Rafaela Camelo e Emanuel Lavor) | quadrado decorativo na seção de catálogo |
| ~~`capahome.png`~~ | still de As Miçangas | **removida** em 10/09/2026. A abertura e o painel "O filme" do Natureza usam `capahome-natureza.jpg` (still 01 do filme); o card de compartilhamento usa `og-moveo.jpg` |
| `logo-moveo.mp4` | a animação da logo (libélula + MOVEO filmes), 12s, desenhada sobre preto a partir do `.mov` com alfa que a cliente mandou | coluna direita do Contato |
| `natureza-teaser.mp4`, `tres.mp4`, `micangas-trailer.mp4` | corretos: vieram do Drive da produção. O de As Miçangas foi cortado antes da cartela de título e da logo da Tarrafa | blocos do Natureza, do Três e de As Miçangas (este, desde 11/09/2026, só na abertura e nos créditos do bloco — eram oito cópias) |

Não confie no nome: antes de usar um vídeo num bloco, extraia quadros e compare
com os stills. (Uma versão anterior deste documento dizia que `misterio.mp4`
sobrava nas "cartelas 02 e 14"; eram 01 e 14.)

**Rótulo de láurea não é enfeite.** Os dois rodapés do selo diziam "Melhor
Filme". A cliente listou festivais em que Três *passou*, não prêmios — trocar só
o nome do festival teria inventado prêmio. Viraram "Seleção Oficial".

**Dois mosaicos dividem uma animação.** O efeito `MIÇANGAS: Fragmented Memory
Mosaic Animation` percorre `[data-micangas-mosaic], [data-tres-mosaic]`. Os
fragmentos nascem com `opacity: 0` inline e só o timeline os revela — um mosaico
novo que não entre nesse seletor fica invisível, sem erro nenhum. Era um
`querySelector` até a cartela 12 pedir o segundo.

**As fotos da home ficam em `public/`, não no bucket.** O mosaico do Três usa
`/imagens/tres/*.jpg` (1400px), servido pela Vercel. A home é a porta de
entrada e não pode depender de o Supabase estar acordado — o plano free pausa
sozinho, e a landing já é desenhada para ficar de pé com ele fora. Os originais
em 2000px continuam no bucket, em `filmes/tres/`, ligados ao filme em
`filmes_assets`. Das sete fotos, seis estão na home; a sétima é a mesma cena da
foto grande.

As grades das cartelas 02 e 03 usam `/imagens/destaques/` (1200px, tarja preta
recortada): são as imagens que a cliente linkou em cada "Imagem X" do documento,
conferidas pelo id do Drive. Cada grade tem 10 espaços e ela escolheu 7 e 8, então
há imagem repetida entre as duas cartelas, nunca dentro da mesma. Três espaços
estreitos têm `objectPosition` para não cortar o rosto. As `secao2home/Rectangle
*.png` continuam em uso em outras seções e páginas (notícias, sobre, contato).

**O texto do mosaico do Três usa `left: min(55%, …)`.** Com `55%` puro, no celular o
bloco passava 46px da borda e era cortado pelo `overflow: hidden`. Não volte para `55%`.
O de As Miçangas deixou de flutuar em 11/09/2026: é uma coluna ao lado da grade de
stills, e os fragmentos são células da grade — a animação compartilhada só mexe em
opacidade e deslocamento, então funciona igual.

**Para verificar animação de rolagem, role pelo Lenis, não pela janela.** O
ScrollTrigger desta home não lê `window.scrollY`: `SmoothScrollProvider.tsx`
instala um `scrollerProxy` que devolve `lenis.scroll`, e o Lenis só recebe
rolagem por evento de roda. `window.scrollTo` às vezes arrasta a trilha e às
vezes não — a revelação da caixa do hero (`onEnter` em `top top`) não disparou
com ele, e parecia que a mudança tinha quebrado a abertura. O que funciona é
`window.dispatchEvent(new WheelEvent('wheel', { deltaY: 40 }))`: um toque pequeno
passa do gatilho sem empurrar a trilha horizontal para longe. `scrollIntoView`
também não serve para painel de trilha.

Com o painel do navegador oculto, duas coisas: a rolagem real da ferramenta
(`computer scroll`) não roda, porque espera a página desenhar; e o `lagSmoothing`
do GSAP conta quadros espaçados como 33ms, então animação e trilha quase não
andam entre screenshots lentos. Uma rajada de screenshots curtos faz alcançar.

**Parte do texto do bloco do Natureza foi escrita sem fonte.** A descrição do
painel "O filme" ("uma jornada visceral através de narrativas invisíveis…"), o
parágrafo do painel da sinopse e uma citação atribuída à Rafaela Camelo não
aparecem em nenhum material da produção. Em 10/09/2026 a descrição ficou só com a
frase que tem fonte, o parágrafo virou a sinopse oficial e a citação saiu. Antes
de manter texto sobre um filme na home, confira se ele está no documento da
cliente, no documento de prêmios ou no banco — e nunca ponha frase na boca de
alguém sem a fonte.

O mesmo valia para as três notícias do carrossel da cartela 15 ("Dois longas
autorais selecionados para Rotterdam…", "Residência Criativa DF", "Co-produção
transatlântica"): texto de exemplo, com data, publicado como notícia da Moveo.
Em 10/09/2026 viraram Não Há Magia em Hamburgo (documento de alterações), os três
prêmios de Gramado e a abertura da Generation KPlus na Berlinale (documento
"ANCI - Exibições e prêmios"). O lançamento comercial do Natureza que a ficha da
cartela 07 cita (27/11/2025, Vitrine Filmes) não está nesse documento e ficou fora.

**A caixa de vídeo do hero depende da imagem de capa.** O GSAP da abertura
procura `img[alt="Capa Home"]` ou `img[src*="capahome"]` para revelar a caixa. Um
efeito zera a opacidade dela; o outro só devolve se achar essa imagem. Por isso o
still do Natureza que entrou em 10/09/2026 se chama `capahome-natureza.jpg` e
manteve o `alt`. Um arquivo sem "capahome" no nome e com outro `alt` deixa a
caixa inteira invisível, sem erro.

**Láureas são arte de festival, não texto nosso.** Ficam em
`public/imagens/laureas/`, brancas, aparadas, a 240px de altura, e são listadas em
`LAUREAS_NATUREZA` no topo de `app/page.tsx`. As de Gramado e do Mix Brasil vinham
pretas (invisíveis no fundo escuro) e foram invertidas; a do Santander vinha numa
caixa cinza opaca, removida por luminância. Os originais estão nas pastas de
láurea da produção no Drive. Os textos alternativos seguem o documento oficial
de prêmios, não o que está escrito na arte.

As de As Miçangas estão em `LAUREAS_MICANGAS` (cartela 10): Hong Kong, Palm Springs,
Huesca, Panorama e Curta Brasília — a mesma arte que a produção usou nos posts e no
cartaz. **Antes de concluir que um festival não tem láurea, abra a pasta inteira**,
com subpastas e compactados: em 10/09 este documento dizia que As Miçangas só tinha
arte de Curta Brasília e do Panorama, mas a de Hong Kong estava num `.zip`, em PDF,
e a de Huesca numa subpasta. Berlinale, Biarritz, Goiânia, Kinoforum, New Directors e
Festival do Rio seguem em texto: nas pastas só há fotos, posts ou logos.

**A numeração visível na tela (`Section index NN`) não é a cartela.** Ela para
no 04 e serve de enfeite editorial.

**O typewriter da cartela 02 reescreve o DOM.** O GSAP troca o texto de cada bloco
por um `<span>` por letra, e o React perde a referência daquele nó. Por isso os textos
da cartela têm `key={language}`: ao trocar o idioma, o React recria o nó. Texto novo
nessa cartela precisa da mesma `key`, senão fica no idioma antigo até recarregar.

**Números fixos na home.** O contador do bloco CATÁLOGO/CINEMA sobe até 12 — o
total de `/catalogo/cinema` em 11/09/2026, escrito duas vezes: no GSAP (`val: 12`) e no
texto inicial do `data-cinema-count`. Filme novo no catálogo não muda esse número; até
11/09 ele dizia 08.

## O que deve virar CMS quando voltarmos

Em ordem de dor. Tudo isto hoje é literal no JSX:

1. **Quais filmes aparecem em destaque e em que ordem.** Hoje são três blocos
   chumbados. Deveria ser uma seleção sobre `filmes`, com `ordem_exibicao`.
2. **A ficha técnica de cada destaque** (minutagem, cor, gênero, classificação,
   direção, elenco, sinopse). Todos esses campos **já existem** em `filmes` e
   estão preenchidos — a home simplesmente não os lê.
3. **As imagens e vídeos de cada bloco.** Já existe `filmes_assets` com `tipo`,
   `url`, `credito` e `is_principal`. A home ignora.
4. **As láureas.** Já existem `filmes_festivais` e `filmes_premiacoes`.
5. **A frase de posicionamento da cartela 03** e os textos de 14/15/16 —
   copy solta, sem tabela. Precisaria de algo tipo `home_blocos`.
6. **As notícias da cartela 15.** A tabela `posts` existe e tem tela no painel,
   mas está vazia e a home não a lê: os três destaques são chaves de tradução
   (`noticia*`) listadas em `lib/noticiasDestaque.ts`, que `/noticias` também mostra
   enquanto não houver posts.

Os itens 2, 3 e 4 são os baratos: o dado já está no banco e etiquetado. O caro é
o 1, porque muda a estrutura da página, e o 5, porque não tem onde guardar.

## Pendências de conteúdo

| O quê | Estado |
|---|---|
| Teaser de Não Há Magia | a cliente ainda não tem — ela escreveu "esperando envio". Vai na transição de ripas diagonais entre o painel de Não Há Magia e As Miçangas, que mostrava o trailer de As Miçangas — o mesmo que passa no bloco seguinte. Até chegar, a transição mostra o aviso "Inserir teaser de Não Há Magia aqui"; quando chegar, volta a ser `<video data-src data-transition-video>` |
| Não Há Magia em inglês | ela só mandou português. Sinopse, formato e lançamento em inglês (home e `filmes.sinopse_en`) são tradução nossa; o título ficou o original |
| Imagem de O Pacto da Viola | link do Drive dá 404; filme também não existe no banco. O espaço dela na cartela 02 (comentário `Linha C` no JSX) mostra o aviso "Inserir imagem de O Pacto da Viola aqui" |
| Doc CATÁLOGO MOVEO SITE | não compartilhado; é o conteúdo da cartela 14. Até chegar, a coluna de vídeo e as três imagens da cartela são avisos "Inserir…" |
| Anos de O Véu de Amani e O Mistério da Carne | resolvidos em 11/09/2026: 2019 e 2018, como na lista do catálogo que ela pôs na cartela 04 e nos currículos. Backup em `../backups/2026-09-10/revisao-documento-antes.json` |
| A Arte de Andar Pelas Ruas de Brasília | está na lista do catálogo da cliente (cartela 04) e no catálogo, mas sem imagem nem sinopse; o print dela mostra um still |
| "Mix Brasil \| México" (cartela 01) | a pasta de láurea só tem a do Mix Brasil; não há arte do Mix México |
| `logline_pt` de A Natureza | a sinopse foi alinhada em 10/09/2026 — a home e `filmes.sinopse_pt`/`sinopse_en` usam a versão curta da cliente. Mas `logline_pt`/`logline_en` ainda guardam a sinopse antiga, que era cópia dela. Nenhuma página exibe a logline hoje; se a home passar a ler `filmes`, ela aparece. Escrever uma logline de verdade é conteúdo |
| Láureas do Três | pedidas na cartela 12; ela não mandou imagem de láurea para este filme, só a lista de festivais |
| Elenco do Três no celular | escondido abaixo de `sm` no painel 2, mesma causa do painel da cartela 07 (coluna de 137px) |
| Láurea do prêmio do Mix Brasil | o filme ganhou o Coelho de Ouro, mas as pastas só têm a láurea de **seleção oficial** — é a que está no hero |
| Láureas de prêmio do Santander | Melhor Roteiro e Prêmio Sundance TV não têm arte própria; o hero usa a de seleção Ópera Prima |
| Grande Otelo | sem arte em pasta nenhuma, vai em texto. Não há versão oficial em inglês — a do site é tradução nossa |
| Texto das artes x prêmio oficial | a arte de Gramado diz "Melhor Atriz" (o prêmio foi de Atriz Coadjuvante); a de Seattle diz "Special Jury Prize" (foi Menção Especial). Arte é do festival; confirmar com a cliente se incomoda |
| IDV do cartaz na abertura | a cliente escreveu "(IDV do cartaz)" na cartela 01 sem anexar arquivo; o título no hero usa a tipografia do site |
| Pré-seleção ao Oscar | a cliente pediu por WhatsApp para "aproveitar o hype" (27/08); não entrou em lugar nenhum do site ainda |
| Painel da cartela 07 no celular | grid de duas colunas fixas que não empilha: a coluna de texto fica com 140px. A sinopse está escondida abaixo de `sm` por isso |
| Cartela 04 | o título do documento diz "retirar", a nota sob o print diz "ok" — **perguntar antes de mexer**. É o cartão "CATÁLOGO EM DESTAQUE", que abre a sequência que a cartela 13 fechava |
