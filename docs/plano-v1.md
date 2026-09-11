# Plano da v1 — MOVEO FILMES

Criado em 10/09/2026. Meta: entregar a v1 hoje.

**Este arquivo é a lista de tarefas.** Item marcado foi feito e verificado, com
o commit ao lado. Item novo entra aqui antes de ser feito, não depois.

Legenda: `[x]` feito · `[ ]` a fazer · `🔒` bloqueado, com quem destrava.

## Regra de trabalho

- Commit vai para a `main` e é empurrado na hora. Push na `main` publica em
  produção; o gate "em breve" continua ligado para o público.
- Antes de cada push: banco respondendo `200` e `pnpm build` limpo.
- O item é marcado aqui no mesmo commit que o conclui.

## 0. Colocar em dia

- [x] Publicar os 16 commits da branch `ajustes-cliente-set2026` e conferir o deploy (`71db194` — deploy concluído; landing para o público, home nova com `/preview`, catálogo com os 18 filmes)
- [x] Escrever este plano

## 1. Home — documento de alterações da cliente

Mapa cartela → código e armadilhas: `docs/home-cartelas.md`.

- [x] Travamento: vídeos só carregam quando entram na tela (`0a33668`)
- [x] Cartela 01 — abertura com foco em A Natureza: teaser, título, láureas (`618c8da`)
- [ ] Cartela 02 — destaques só com filmes prontos (6 das 7 imagens; O Pacto da Viola 🔒 cliente)
- [x] Cartela 03 — frase de posicionamento (`cb99eff`)
- [ ] Cartela 03 — destacar A Natureza, As Miçangas, Três e Lubrina com as 8 imagens enviadas
- 🔒 Cartela 04 — o documento diz "retirar" e "ok" ao mesmo tempo (cliente)
- [x] Cartela 05 — vídeo de A Natureza: o bloco inteiro usava material de As Miçangas; agora é o teaser, e a descrição perdeu a frase inventada
- [ ] Abertura — `capahome.png` é um still de As Miçangas sobreposto ao teaser do Natureza; trocar a imagem mantendo nome e `alt` (o GSAP depende dos dois)
- [x] Cartela 06 — festivais e destaques com links: festivais e prêmios, láureas, presskit, fotos das pré-estreias, distribuidoras
- [x] Chaves de tradução que apareciam cruas na tela: "colombia", "mexico", "uruguai" (pt) e "catalogoEm", "destaque" (en)
- [x] Cartela 07 — ficha técnica com formato, elenco e sinopse (`f618e04`)
- [x] Painel da sinopse (cartela 07): parágrafo sem fonte e citação atribuída à Rafaela Camelo que não existe em nenhum material — trocar pela sinopse oficial e tirar a citação
- [ ] Cartela 08 — bloco novo de Não Há Magia com ficha e stills (teaser 🔒 cliente)
- [x] Cartela 09 — As Miçangas: o bloco mostrava retratos da Lubrina; agora é o trailer do filme, com sinopse, formato, elenco, direção (são dois diretores, o site dava um), roteiro e coprodução da ficha técnica oficial
- [ ] Cartela 10 — As Miçangas: láureas e festivais em destaque
- [x] Cartelas 11 e 12 — Três no lugar de O Mistério da Carne, circulação e fotos (`a74f54a`, `9328bc8`)
- [x] Cartela 13 — removida (`cbc2a0a`)
- [x] Cartela 14 — título não cobre mais o texto (`5c68829`)
- 🔒 Cartela 14 — conteúdo de "outros trabalhos" (doc CATÁLOGO MOVEO SITE sem acesso — cliente)
- [ ] Cartela 15 — notícias com link para Instagram e Vimeo
- 🔒 Cartela 15 — sincronização automática com o Instagram (acesso à conta — cliente)
- [ ] Cartela 16 — vídeo da logo no lugar do frame de As Miçangas
- [ ] Sobre — materiais de portfólio: currículo da Moveo (pt/en), Daniela Marinho (bio e retrato)

## 2. Catálogo e dados

- [x] Bucket `moveo-assets` criado — todo upload do painel falhava
- [x] Fichas de Três, As Miçangas e A Natureza; Não Há Magia cadastrado como rascunho
- [x] 26 imagens no bucket, ligadas aos filmes, com crédito de fotografia
- [x] Sinopse de A Natureza alinhada com a versão da cliente
- [x] Sinopse em inglês de As Miçangas no banco (estava vazia)
- [ ] Classificar em `cinema` os filmes da lista da cliente; o que não tiver certeza fica sem categoria
- [ ] `/catalogo/cinema` filtra por categoria (decidido: `/catalogo` é o acervo inteiro)
- [ ] Créditos de direção e elenco de Três, As Miçangas e Não Há Magia
- [x] Limpeza: 8 assets `about:blank` e Daniela Marinho duplicada em `pessoas` — backup em `../backups/2026-09-10/limpeza-daniela-e-assets.json`; os 2 créditos da cópia foram para a Daniela com slug (um era repetido e saiu)
- 🔒 Anos conflitantes: O Véu de Amani (2017 × 2019), Mistério da Carne (2019 × 2018) — cliente
- 🔒 Logline de A Natureza ainda é a sinopse antiga — cliente

## 3. Código

- [x] Link de e-mail inválido explica o motivo (`ff0de60`)
- [x] Crédito de empresa lia coluna inexistente (`50501d1`)
- [ ] Página de detalhe do filme entrega só as colunas que usa (hoje a linha inteira vai no HTML)
- [ ] Estado do painel na URL (F5 e link direto)
- [ ] Upload feito antes de salvar não vira arquivo órfão em `filmes/new/`
- [ ] Rotas-esqueleto `/filme/[slug]` e `/empresa/[slug]`
- [ ] 12 erros de ESLint pré-existentes

## 4. Entrega da v1

- [ ] Mensagem para a cliente com o que ela precisa fazer
- 🔒 Conta da cliente no painel — ela cria em `/auth/signup`
- 🔒 Fechar o signup depois que a conta dela existir
- 🔒 Desligar o gate "em breve" — decisão de lançamento (Clayton)

## Pendências da cliente, para resolver na entrega

Detalhe em `docs/home-cartelas.md`: teaser de Não Há Magia · imagem e ficha de O
Pacto da Viola · doc CATÁLOGO MOVEO SITE · decisão da cartela 04 · anos
conflitantes · acesso ao Instagram · IDV do cartaz · pré-seleção ao Oscar ·
láureas de prêmio do Mix Brasil e do Santander · Grande Otelo em inglês · texto
das artes de Gramado e de Seattle · logline de A Natureza · grafia do elenco de As
Miçangas (o documento diz Letícia Ferraz, a ficha técnica diz Tícia) · financiamento
de As Miçangas (o site dizia "FAC-DF, Edital Cardume", sem fonte; saiu).
