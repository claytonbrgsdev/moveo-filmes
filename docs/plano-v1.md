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
- [x] Cartela 02 — destaques só com filmes prontos: as 6 imagens que a cliente linkou (Três, As Miçangas, A Natureza, Lubrina, O Mistério da Carne, O Véu de Amani), em `public/imagens/destaques/`
- 🔒 Cartela 02 — imagem de O Pacto da Viola (o link do documento dá 404 — cliente); o espaço dela está com outro still do Natureza
- [x] Cartela 03 — frase de posicionamento (`cb99eff`)
- [x] Cartela 03 — A Natureza, As Miçangas, Três e Lubrina com as 8 imagens enviadas; a grade tem 10 espaços, nenhuma imagem se repete dentro da cartela
- 🔒 Cartela 04 — o documento diz "retirar" e "ok" ao mesmo tempo (cliente)
- [x] Cartela 05 — vídeo de A Natureza: o bloco inteiro usava material de As Miçangas; agora é o teaser, e a descrição perdeu a frase inventada
- [x] Abertura — a `capahome.png` (still de As Miçangas) virou `capahome-natureza.jpg`, still do Natureza, também no painel "O filme"; mesmo `alt` e "capahome" no nome, que é o que o GSAP procura
- [x] Card de compartilhamento (Open Graph) — usava a mesma `capahome.png`, declarada 1920×1080 sem ser; agora `og-moveo.jpg` 1200×630, still do Natureza. É a prévia que aparece quando o link for mandado à cliente
- [x] Cartela 06 — festivais e destaques com links: festivais e prêmios, láureas, presskit, fotos das pré-estreias, distribuidoras
- [x] Chaves de tradução que apareciam cruas na tela: "colombia", "mexico", "uruguai" (pt) e "catalogoEm", "destaque" (en)
- [x] Cartela 07 — ficha técnica com formato, elenco e sinopse (`f618e04`)
- [x] Painel da sinopse (cartela 07): parágrafo sem fonte e citação atribuída à Rafaela Camelo que não existe em nenhum material — trocar pela sinopse oficial e tirar a citação
- [x] Cartela 08 — Não Há Magia: painel novo entre A Natureza e a transição para As Miçangas, com o still da pedra, faixa com os outros quatro, ficha e sinopse do documento
- 🔒 Cartela 08 — teaser de Não Há Magia (cliente: "esperando envio"); entra no lugar do still grande
- [x] Notícias (cartela 15) — os três destaques do carrossel eram texto de exemplo ("Dois longas autorais selecionados para Rotterdam…", "Residência Criativa DF", "Co-produção transatlântica"); agora são Não Há Magia em Hamburgo, os três prêmios de Gramado e a abertura da Generation KPlus na Berlinale, com foto de cada filme
- [x] Cartela 09 — As Miçangas: o bloco mostrava retratos da Lubrina; agora é o trailer do filme, com sinopse, formato, elenco, direção (são dois diretores, o site dava um), roteiro e coprodução da ficha técnica oficial
- [x] Cartela 10 — As Miçangas: os 11 festivais do documento em destaque, com o prêmio de Melhor Curta do Panorama (em texto: só há láurea em arte de Curta Brasília e do Panorama)
- [x] Cartelas 11 e 12 — Três no lugar de O Mistério da Carne, circulação e fotos (`a74f54a`, `9328bc8`)
- [x] Cartela 13 — removida (`cbc2a0a`)
- [x] Cartela 14 — título não cobre mais o texto (`5c68829`)
- 🔒 Cartela 14 — conteúdo de "outros trabalhos" (doc CATÁLOGO MOVEO SITE sem acesso — cliente)
- [x] Cartela 15 — links para o Instagram e o Vimeo na lateral de Notícias e nos botões do Contato (a lateral some no celular; o Contato não)
- 🔒 Cartela 15 — sincronização automática com o Instagram (acesso à conta — cliente)
- [x] Cartela 16 — vídeo da logo no lugar do frame de As Miçangas (animação `LOGO BRANCA - SEM FUNDO.mov` sobre preto, 285KB; `object-contain` para a palavra MOVEO não ser cortada na coluna estreita)
- [x] Sobre — materiais de portfólio: textos de Sobre e Equipe dos currículos da empresa e da Daniela Marinho, retrato dela (Paula Carrubba) no lugar do placeholder, lista de produções do currículo e fotos dos filmes no lugar da `secao2home`
- 🔒 Sobre em inglês — os currículos em inglês não abriram (404); o inglês da página é tradução nossa (cliente)

## 2. Catálogo e dados

- [x] Bucket `moveo-assets` criado — todo upload do painel falhava
- [x] Fichas de Três, As Miçangas e A Natureza; Não Há Magia cadastrado como rascunho
- [x] 26 imagens no bucket, ligadas aos filmes, com crédito de fotografia
- [x] Sinopse de A Natureza alinhada com a versão da cliente
- [x] Sinopse em inglês de As Miçangas no banco (estava vazia)
- [x] Não Há Magia publicado no catálogo (`cinema`, público — eram rascunho e sem categoria), com sinopse em inglês traduzida por nós; backup em `../backups/2026-09-10/nao-ha-magia-antes-de-publicar.json`
- [x] Classificar em `cinema` os filmes da lista da cliente e os já lançados (9); ficam sem categoria os 3 sem ano, sinopse nem imagem e o rascunho — backup em `../backups/2026-09-10/categorias-antes.json`
- [x] `/catalogo/cinema` filtra por categoria (decidido: `/catalogo` é a visão geral) — a página estática lista os 9; 10 desde que Não Há Magia foi publicado
- [x] Créditos de direção e elenco de Três, As Miçangas e Não Há Magia — 13 pessoas, 5 créditos, 10 no elenco; ids em `../backups/2026-09-10/criados-creditos-elenco.json`
- [x] Limpeza: 8 assets `about:blank` e Daniela Marinho duplicada em `pessoas` — backup em `../backups/2026-09-10/limpeza-daniela-e-assets.json`; os 2 créditos da cópia foram para a Daniela com slug (um era repetido e saiu)
- 🔒 Anos conflitantes: O Véu de Amani (2017 × 2019), Mistério da Carne (2019 × 2018) — cliente
- 🔒 Logline de A Natureza ainda é a sinopse antiga — cliente

## 3. Código

- [x] Link de e-mail inválido explica o motivo (`ff0de60`)
- [x] Crédito de empresa lia coluna inexistente (`50501d1`)
- [x] Página de detalhe do filme entrega só as colunas que usa — antes iam no HTML `valor` e `observacoes` de financiamento, observações de festival, `tags`, e-mail e telefone de empresa
- [x] Galeria da página de detalhe vazia: filtrava `tipo = 'imagem'` e os 29 assets do banco são `still` (o painel oferece os dois)
- 🔒 Chave pública lê colunas internas pela API (2 valores de financiamento, 6 observações): o HTML já não leva, mas quem consulta o REST com a chave anônima lê. Proteger exige permissão por coluna ou view no banco — decisão (Clayton)
- [ ] Estado do painel na URL (F5 e link direto) — mexe na navegação do /central, que só dá para testar logado; fica para depois da entrega, com sessão de admin
- [x] Upload feito antes de salvar não vira arquivo órfão em `filmes/new/` — nos quatro formulários o envio só libera depois de salvar (verificado por tipo e lint; o /central não foi aberto no navegador porque exige login)
- [x] Rotas-esqueleto `/filme/[slug]` e `/empresa/[slug]` removidas — devolviam `null` (página em branco) e nada no site apontava para elas. O filme mora em `/catalogo/*/[slug]`; página de empresa não existe
- [ ] 12 erros de ESLint pré-existentes — são efeitos dos componentes do /central; mesma condição do item acima

## 4. Entrega da v1

- [x] Mensagem para a cliente com o que ela precisa fazer — texto entregue ao Clayton em 10/09/2026, para mandar junto com o link
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
de As Miçangas (o site dizia "FAC-DF, Edital Cardume", sem fonte; saiu) · láureas de As
Miçangas em arte (só existem as de Curta Brasília e do Panorama) · Feijão com Arroz, O Colar
de Coralina e Uma Dose Violenta de Qualquer Coisa (sem ano, sinopse nem imagem, por isso
fora das listagens) · Não Há Magia em inglês (sinopse, formato e lançamento são tradução nossa) · inglês do /sobre (tradução nossa; os currículos em inglês não abriram) · durações e anos que divergem entre fontes (As Miçangas: 18 min no currículo, 19 na ficha técnica).
