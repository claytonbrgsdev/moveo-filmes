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
| 01 | primeiro `<section>` do arquivo, `Section index 01` | Abertura / hero |
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

**`misterio.mp4` continua em uso.** Fora do bloco de destaque ele aparece na
cartela 02 (grade de destaques) e na coluna de vídeo da cartela 14. Não apague
o arquivo achando que ele sobrou da troca.

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

**Para ver um painel da trilha, não use `scrollIntoView`.** A trilha é presa à
rolagem vertical: role a página até o fim (ou a fração certa) do `pin-spacer`
que a contém. E com o painel do navegador oculto o `lagSmoothing` do GSAP conta
quadros espaçados como 33ms, então a trilha quase não anda entre screenshots
lentos — uma rajada de screenshots curtos faz ela alcançar.

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
| Sinopse de A Natureza | a home usa a versão curta que a cliente escreveu na cartela 07; `filmes.sinopse_pt` ainda tem a antiga, mais longa, que é a que aparece em `/catalogo/cinema/[slug]` |
| Láureas do Três | pedidas na cartela 12; ela não mandou imagem de láurea para este filme, só a lista de festivais |
| Elenco do Três no celular | escondido abaixo de `sm` no painel 2, mesma causa do painel da cartela 07 (coluna de 137px) |
| Painel da cartela 07 no celular | grid de duas colunas fixas que não empilha: a coluna de texto fica com 140px. A sinopse está escondida abaixo de `sm` por isso |
| Cartela 04 | o título do documento diz "retirar", a nota sob o print diz "ok" — **perguntar antes de mexer**. É o cartão "CATÁLOGO EM DESTAQUE", que abre a sequência que a cartela 13 fechava |
