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
| 11 | `O MISTÉRIO DA CARNE - Panel 0` | **Vira Três** |
| 12 | `O MISTÉRIO DA CARNE - Panel 1` e `Panel 2` | **Vira Três** (circulação) |
| 13 | `Finale: End of showcase` | "Esses e muitos outros…" |
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

**Trocar o filme de um bloco é mais do que trocar o texto.** Os três painéis de
um filme compartilham o mesmo arquivo de vídeo, atributos `data-video-parallax`
com o nome do filme, e as transições vizinhas. Trocar O Mistério da Carne por
Três significa vídeo, imagens, ficha, `data-*` e as duas transições.

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
| Cartela 04 | o título do documento diz "retirar", a nota sob o print diz "ok" |
