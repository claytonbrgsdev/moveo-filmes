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
| 02 | segundo `<section>` | Destaques (grade de imagens) |
| 03 | terceiro `<section>` | Destaques + frase de posicionamento |
| 04 | `Seção de Transição - Introdução ao Catálogo`, `Section index 04` | Cartão "CATÁLOGO EM DESTAQUE" |
| 05 | `Seção 1 - A Natureza das Coisas Invisíveis - Title Only` | Título do filme |
| 06 | `Seção 2 - A Natureza … - Editorial` | Festivais e destaques |
| 07 | `Seção 3 - A Natureza … - Full Background` | Ficha técnica |
| 08 | **não existe** | Bloco novo: Não Há Magia |
| 09 | `AS MIÇANGAS - Panel 0: Film Strip Reveal` | Destaque do filme |
| 10 | `AS MIÇANGAS - Panel 1` e `Panel 2` | Láureas e créditos |
| 11 | `TRÊS - Panel 0: Venetian Blind Reveal` | **Três** desde 10/09/2026 — era O Mistério da Carne |
| 12 | `TRÊS - Panel 1`, `Panel 2` e `Panel 3` | **Três**: circulação, ficha e mosaico de fotos de divulgação |
| 13 | ~~`Finale: End of showcase`~~ | **removida** em 10/09/2026, a pedido da cliente |
| 14 | `<section>` seguinte ao finale | "ALÉM DOS FILMES" |
| 15 | penúltimo `<section>` | Notícias |
| 16 | último `<section>` | Vídeo da logo |

Entre 08/09 e entre 10/11 existem `<section>` de transição (`Transition:
Natureza → Miçangas`, `Transition: Miçangas → Mistério`) que não são cartelas —
são passagens animadas. Mexer nos filmes em destaque mexe nelas também.

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

**`misterio.mp4` não é d'O Mistério da Carne — é material da Lubrina.** A moça
de tranças na porta de casa é a mesma dos stills da Lubrina, no mesmo cenário, e
o print que a cliente mandou da abertura trazia uma legenda sobre a Lubrina em
cima dele. Hoje só a coluna de vídeo da cartela 14 o usa. Não apague o arquivo.
(Uma versão anterior deste texto dizia "cartelas 02 e 14"; eram 01 e 14. O da
01, a caixa de vídeo do hero, virou o teaser do Natureza.)

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

**O texto dos mosaicos usa `left: min(55%, …)`.** Com `55%` puro, no celular o
bloco passava 46px da borda e era cortado pelo `overflow: hidden` — nas
Miçangas desde sempre, no Três por herança. Não volte para `55%`.

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

**A caixa de vídeo do hero depende da `capahome.png`.** O GSAP da abertura
procura `img[alt="Capa Home"]` ou `img[src*="capahome"]` para revelar a caixa. Um
efeito zera a opacidade dela; o outro só devolve se achar essa imagem. Trocar ou
renomear a imagem deixa a caixa inteira invisível, sem erro.

**Láureas são arte de festival, não texto nosso.** Ficam em
`public/imagens/laureas/`, brancas, aparadas, a 240px de altura, e são listadas em
`LAUREAS_NATUREZA` no topo de `app/page.tsx`. As de Gramado e do Mix Brasil vinham
pretas (invisíveis no fundo escuro) e foram invertidas; a do Santander vinha numa
caixa cinza opaca, removida por luminância. Os originais estão nas pastas de
láurea da produção no Drive. Os textos alternativos seguem o documento oficial
de prêmios, não o que está escrito na arte.

**A numeração visível na tela (`Section index NN`) não é a cartela.** Ela para
no 04 e serve de enfeite editorial.

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

Os itens 2, 3 e 4 são os baratos: o dado já está no banco e etiquetado. O caro é
o 1, porque muda a estrutura da página, e o 5, porque não tem onde guardar.

## Pendências de conteúdo

| O quê | Estado |
|---|---|
| Teaser de Não Há Magia | a cliente ainda não tem — ela escreveu "esperando envio" |
| Imagem de O Pacto da Viola | link do Drive dá 404; filme também não existe no banco |
| Doc CATÁLOGO MOVEO SITE | não compartilhado; é o conteúdo da cartela 14 |
| Ano de O Véu de Amani | banco diz 2017, a lista dela diz 2019 |
| Ano de Mistério da Carne | banco diz 2019, a lista dela diz 2018 |
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
