# MOVEO FILMES

Produtora de cinema independente (Brasília, 2018). Site institucional +
catálogo + CMS próprio, tudo num Next.js só.

Infra (domínio, Vercel, Supabase, e-mail, contas): `../README-INFRA.md` —
fica **fora** do repositório, na pasta acima.

Última revisão desta página: **10/09/2026**.

---

## Estado em 09/09/2026

**A revalidação está provada em produção.** Em 09/09 uma edição feita no
`/central` (título em inglês de um filme) apareceu no site em ~1 minuto, com o
último deploy datando de uma hora antes — ou seja, não foi rebuild, foi
revalidação, na infra de cache da Vercel.

**As URLs de auth do Supabase foram corrigidas**: Site URL é
`https://moveofilmes.com` e `https://moveofilmes.com/**` está na allow-list de
Redirect URLs. Verificado funcionalmente (um `redirect_to` para o domínio volta
honrado; um domínio de fora cai no fallback).


**A constraint de `categoria_site` foi relaxada** (migração
`supabase/migrations/002`, aplicada em produção em 09/09/2026): o banco agora
aceita as seis categorias que o site sempre assumiu, incluindo `cinema` e
`mostra`. Falta o outro lado disso — ver *Pendências*.

**O painel ganhou a seção Empresas.** CRUD completo, mais o select de empresa
no painel de créditos do filme, que não existia — 30 dos 57 créditos apontam
para empresas e apareciam no painel como cargo sem nome. **No ar desde
10/09/2026** (commit `68cc7d9`, deploy verificado: catálogo com os 18 filmes
intactos, `/central` e as rotas novas guardadas).

O Supabase **estava pausado e foi retomado**. Dados intactos e conferidos:
18 filmes, 21 pessoas, 20 empresas, 10 itens de catálogo, 0 posts, 1 conta no
Auth (`claytonborgesdev@gmail.com`).

> **Ao retomar, o banco aparece VAZIO por alguns minutos.** Durante o resume o
> `public` fica sem nenhuma tabela e o `auth.users` com zero linhas, enquanto o
> REST devolve 502/521. Não é perda de dados — é o restore em andamento.
> Esperar o PostgREST responder `200` antes de concluir qualquer coisa. Isso
> assustou de verdade nesta sessão.

**O keep-alive voltou a funcionar** — os três secrets foram cadastrados em
09/09/2026 e o workflow passou pela primeira vez em 24 execuções (as 23
anteriores, desde 07/08, falharam todas por falta de secret). O primeiro
artifact de backup do projeto existe desde então.

Os quatro secrets do repositório estão cadastrados — o
`VERCEL_DEPLOY_HOOK_URL` foi criado pela API da Vercel em 09/09/2026 (hook
`instagram-sync`, ref `main`) porque o painel estava atrás de uma tela de 2FA.
O hook nunca foi disparado para teste: dispará-lo publica em produção.

### Antes de buildar ou deployar, confirme que o banco responde

`pnpm build` lê o Supabase. Com o banco fora do ar o build **passa** mas assa o
catálogo vazio — e push na `main` publica isso em produção sozinho.

```bash
curl -s -o /dev/null -w "%{http_code}\n" "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/filmes?select=id&limit=1" -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

`200` é o único resultado que libera. `000`/`NXDOMAIN` = pausado;
`502`/`521` = subindo, espere.

Para retomar: painel do Supabase → *Resume project*. São **dois** cliques — o
botão abre um diálogo com um segundo *Resume*, e parar no primeiro não faz nada
(a tela fica idêntica).

### Backups

| Onde | O quê |
|---|---|
| artifact do workflow, semanal | `supabase db dump` de schema e dados, retido 90 dias |
| `../backups/2026-09-09/` | dump manual desta sessão: 13 tabelas em JSON (265 linhas) + schema |

O `pg_dump` local é 14 e o servidor é 17 — incompatíveis. Por isso o dump
manual saiu via PostgREST em JSON, não como `.sql` restaurável. Quem precisar
de um dump restaurável na mão: instalar o cliente 17, ou baixar o artifact do
workflow.

**A conexão direta (`db.<ref>.supabase.co`) é só IPv6** — GitHub Actions não
alcança. Qualquer conexão a partir de CI tem que usar o *session pooler*
(`aws-0-sa-east-1.pooler.supabase.com:5432`, usuário `postgres.<ref>`). O
transaction pooler (6543) conecta mas não serve para `pg_dump`.

---

## Rodar

```bash
pnpm dev
```

Abre em `localhost:3000`. Gate da landing fica **desligado** em dev.

Para testar cache/ISR/revalidação, `pnpm dev` **não serve** — em dev o Next
re-renderiza tudo a cada request e qualquer coisa parece funcionar. Use o
modo produção (há uma config `prod` no `.claude/launch.json`, porta 3020):

```bash
pnpm build && npx next start -p 3020
```

Aí o gate liga (é `NODE_ENV=production`). Passe `-H "Cookie: moveo_preview=on"`
no curl, ou abra `/preview` uma vez no navegador.

---

## Como o site chega ao ar

Push na `main` **publica em produção sozinho** (Vercel conectada ao GitHub).
Não existe staging. Commitar é publicar.

Todas as páginas públicas são estáticas (`○`) ou SSG (`●`) — conferível no
quadro de rotas no fim do `pnpm build`. Nenhuma toca o banco em runtime.

---

## O contrato do CMS — a regra não óbvia

O painel vive em `/central`. Salvar lá grava no Supabase **e republica as
páginas afetadas na hora**. Isso só funciona porque há duas camadas de cache e
as duas são invalidadas:

| Camada | Guarda | Invalida com |
|---|---|---|
| Data Cache | a resposta do Supabase, gravada no build | `revalidateTag` |
| Full Route Cache | o HTML pronto | `revalidatePath` |

Só `revalidatePath` faz a rota re-renderizar — **com os mesmos dados velhos**,
porque a query volta do Data Cache. Por isso as etiquetas.

| Arquivo | Papel |
|---|---|
| `lib/cache/tags.ts` | as três etiquetas: `filmes`, `posts`, `pessoas` |
| `lib/supabase/cached.ts` | cliente Supabase que etiqueta as queries públicas |
| `lib/cache/revalidate.ts` | o que republicar depois de mexer em cada entidade |

### Três regras que quebram isso em silêncio

1. **Toda página pública precisa do cliente etiquetado.** Páginas diferentes
   que fazem a mesma query dividem a mesma entrada de cache; uma sem etiqueta
   sobrescreve a etiquetada e o painel para de publicar, sem erro nenhum. Use
   `createCachedAnonClient` / `createCachedServiceClient`, **nunca** o
   `createClient` do `@supabase/supabase-js` direto. Conferir com:

   ```bash
   grep -rn "@supabase/supabase-js" app --include="*.tsx" | grep -v "app/central\|app/api"
   ```

   Tem que voltar vazio.

2. **Rota admin nova que escreve precisa chamar a revalidação.** Hoje são 20
   arquivos de rota com 36 chamadas — todo POST/PATCH/DELETE que existe já
   chama. Os 5 arquivos restantes dos 25 só têm GET (os quatro `slug-check` e
   o `upload`). Veja qualquer um em `app/api/admin/`.

   Empresa é o caso a estudar quando a entidade nova não tem página própria:
   `revalidarEmpresas` invalida `TAG_FILMES`, porque empresa só aparece no site
   dentro dos créditos, carregada no mesmo `select` do filme. Etiqueta nova ali
   não invalidaria nada — nenhum fetch a carregaria.

3. **`revalidateTag` do Next 16 exige um segundo argumento.** Aqui é
   `{ expire: 0 }`, não o `'max'` que a doc recomenda: `'max'` é
   stale-while-revalidate com `stale: 300`, ou seja, o site mostraria o
   conteúdo antigo por cinco minutos depois do "salvar".

Conteúdo **novo** não precisa de tratamento: slug que não existia no build
renderiza sob demanda na primeira visita (`dynamicParams` no padrão).

Isto vale para conteúdo. Mudança de **código** continua exigindo deploy.

### Como verificar que ainda funciona

Em `pnpm dev` **qualquer coisa parece funcionar**. A verificação honesta usa
build de produção e uma linha-sonda no banco:

1. `pnpm build && npx next start -p 3020`
2. Ler `/catalogo/cinema` uma vez (aquece o cache) e conferir que a sonda não
   está lá.
3. Inserir no Supabase um filme com slug `zzz-sonda` e
   **`visibilidade: 'publico'`** — as páginas públicas usam a chave anônima e a
   RLS esconde `rascunho`; com rascunho a sonda não aparece nunca e você
   conclui errado que a revalidação quebrou (aconteceu).
   `categoria_site` aceita os seis valores do site, ou `NULL`.
4. Ler a página de novo: a sonda **não** deve aparecer. É o cache fazendo o
   trabalho dele.
5. Disparar a revalidação e ler de novo: a sonda **deve** aparecer.
6. Apagar a sonda do banco e revalidar: some.

Disparar a revalidação exige sessão de admin. Para testar sem login, criar uma
rota temporária que chame as funções de `lib/cache/revalidate.ts` — e lembrar
que **pasta começando com `_` não vira rota**.

Sinais úteis nos headers: `x-nextjs-cache: HIT|MISS` diz se o Full Route Cache
foi invalidado; as entradas de `.next/cache/fetch-cache` guardam as etiquetas
(`tags: ['filmes']`) e mostram se a página foi mesmo etiquetada.

---

## Acesso ao /central

Três portas em série:

1. **Gate da landing** (só em produção) — abrir `/preview` uma vez grava um
   cookie de 30 dias. `/auth/*` está fora do gate de propósito: link de
   recuperação de senha abre em navegador sem cookie.
2. **Sessão Supabase** — `/auth/login`, e-mail e senha.
3. **Whitelist** — o e-mail precisa estar em `ADMIN_EMAILS` (está correto na
   Vercel, nos três ambientes).

Reconferido em 09/09/2026 com o banco no ar: existe **uma** conta no Supabase
Auth, `claytonborgesdev@gmail.com`. O `moveofilmes@gmail.com` está na whitelist
mas **não tem conta** — a cliente ainda não consegue entrar. Criar a conta é
por `/auth/signup` ou pelo painel do Supabase.

---

## Estrutura

- `app/central/` — o CMS. `CentralClient.tsx` é uma SPA de estado local com 5
  seções (Dashboard, Filmes, Pessoas, Empresas, Posts). `FilmeForm.tsx` é o
  maior componente (~700 linhas) e, em modo edição, monta 6 painéis de tabelas
  filhas em `components/sub/`.
- `app/api/admin/` — 25 rotas REST, todas com `requireAdmin` + service role.
- `app/catalogo/`, `app/pessoa/`, `app/posts/`, `app/post/` — páginas públicas.
- `app/page.tsx` — home, 271KB, GSAP ScrollTrigger com carrosséis horizontais.
- `lib/supabase/service.ts` — cliente **sem** cache, para o painel e as rotas
  admin. Não confundir com o `cached.ts`.
- `middleware.ts` — gate da landing, depois refresh da sessão Supabase. O gate
  roda **antes** do Supabase de propósito: a landing fica de pé com o banco
  fora do ar.

Tabelas: `filmes`, `posts`, `pessoas`, `empresas`, `catalogo`,
`filmes_{assets,creditos,elenco,festivais,financiamentos,premiacoes,relacionamentos}`,
`pessoas_filmografias`.

---

## Armadilhas conhecidas

**O catálogo mostra números que não fecham.** `/catalogo/cinema` lista
**todos** os filmes sem filtrar `categoria_site`, enquanto as páginas de etapa
filtram e o índice `/catalogo` conta por categoria. Como doze dos dezoito
filmes estão com `categoria_site` nulo, o índice soma 6 e a página de cinema
mostra 18. Não dá para consertar só no código: depende de classificar os
filmes no painel e de decidir se "Cinema" é uma categoria como as outras ou a
visão geral do acervo (ver *Pendências*).

**Rotas-esqueleto.** `app/empresa/[slug]` e `app/filme/[slug]` aparecem no
quadro de rotas do build, mas `generateStaticParams` devolve `[]` e o
componente devolve `null`. Não são páginas; não confunda a presença delas com
a existência de uma página de empresa.

**Upload antes de salvar vira órfão.** No filme novo o `storagePath` usa
`filmes/${filmeId ?? 'new'}/…`, então o arquivo cai numa pasta `new/` e nunca
é reassociado. Também não há limpeza de storage no delete.

**12 erros de ESLint pré-existentes** (`react-hooks/set-state-in-effect`), a
maioria em `app/central/components/`. Não quebram build nem runtime. São
anteriores a este trabalho — não são regressão.

**`/auth/callback` engole erro de token.** Token inválido não avisa nada: cai
em `/auth/reset-password`, que não acha sessão e rebota para `/auth/login`.

**Pastas com `_` não viram rota.** `app/api/__foo/` é pasta privada do App
Router e não existe como endpoint — custou uma rodada de debug.

---

## Pendências abertas

| O quê | Estado |
|---|---|
| **Home chumbada em código** (`app/page.tsx`) | decisão de 10/09/2026: aplicar as alterações da cliente direto no JSX para entregar antes de 16/09, e tornar a home editável no CMS depois. Mapa cartela → código, o que já mudou, armadilhas e o que deve virar CMS: **`docs/home-cartelas.md`** |
| Conta da cliente (`moveofilmes@gmail.com`) | está em `ADMIN_EMAILS`, mas não existe no Auth. `/auth/signup` é aberto: ela pode criar a própria, com a senha dela |
| Deploy hook nunca testado | existe e está no secret, mas dispará-lo publica em produção |
| Classificar os 12 filmes sem `categoria_site` | trabalho editorial, pelo `/central`. O banco já aceita as seis categorias |
| `/catalogo/cinema` não filtra por categoria | **decidido em 10/09/2026**: `/catalogo` é o acervo inteiro e `/catalogo/cinema` vira categoria como as outras; filme sem classificação certa fica sem categoria. Falta implementar o filtro — e classificar antes, senão a página cai de 18 filmes para 0 |
| Tabela `catalogo` | 10 linhas, mas **nenhum código lê** — só aparece nos tipos gerados. As páginas `/catalogo/*` consultam `filmes`. Não construir CRUD antes de decidir se a tabela deve existir |
| `filmes_relacionamentos`, `pessoas_filmografias` | sem tela no painel |
| Estado do painel na URL | sem deep link; F5 volta ao dashboard. As quatro listas já têm busca; falta paginação |
