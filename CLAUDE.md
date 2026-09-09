# MOVEO FILMES

Produtora de cinema independente (Brasília, 2018). Site institucional +
catálogo + CMS próprio, tudo num Next.js só.

Infra (domínio, Vercel, Supabase, e-mail, contas): `../README-INFRA.md` —
fica **fora** do repositório, na pasta acima.

Última revisão desta página: **09/09/2026**.

---

## ⚠️ Leia antes de mexer em qualquer coisa

**O Supabase está pausado.** Verificado em 09/09/2026: o host
`votgiixlnrhfacrjihtx.supabase.co` devolve `NXDOMAIN` — é a assinatura de
projeto pausado no plano free. Enquanto durar:

- o CMS não funciona (sem login, sem leitura, sem escrita);
- **não rodar `pnpm build` e não deployar** — o build lê o banco e assaria o
  catálogo vazio por cima do conteúdo bom que está no ar;
- o site público continua normal, porque é 100% estático desde o build.

Para retomar: painel do Supabase → *Resume project*. São **dois** cliques — o
botão abre um diálogo com um segundo *Resume*, e parar no primeiro não faz nada
(a tela fica idêntica). Depois confirme com:

```bash
curl -s -o /dev/null -w "%{http_code}\n" "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/filmes?select=id&limit=1" -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

**O keep-alive que deveria ter evitado isso nunca funcionou.** 23 execuções
agendadas desde 07/08/2026, *todas* falhando, porque os secrets do repositório
nunca foram cadastrados — `gh secret list` volta vazio. O `README-INFRA.md`
afirmava que os do ping "já existem"; era falso, e está corrigido lá.
Consequência dupla: nada segurou o banco de pé, e **não existe nenhum backup**
(o dump semanal é `skipped`, zero artifacts no repositório).

Secrets que faltam em `claytonbrgsdev/moveo-filmes`:

| Secret | Para quê |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ping do keep-alive |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ping do keep-alive |
| `SUPABASE_DB_URL` | dump semanal (o backup que não existe) |
| `VERCEL_DEPLOY_HOOK_URL` | rebuild disparado pelo instagram-sync |

Os três primeiros valores estão no `.env.local`. Cadastrar com `gh secret set`.

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

2. **Rota admin nova que escreve precisa chamar a revalidação.** Hoje são 18
   arquivos de rota com 33 chamadas — todo POST/PATCH/DELETE que existe já
   chama. Veja qualquer um em `app/api/admin/`.

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
   `categoria_site` tem que ser um dos quatro valores aceitos (ver armadilhas).
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

Em 06/08/2026 existia **uma** conta no Supabase Auth:
`claytonborgesdev@gmail.com`. O `moveofilmes@gmail.com` está na whitelist mas
**não tinha conta** — a cliente não conseguiria entrar. Não reconferível hoje
(banco pausado).

---

## Estrutura

- `app/central/` — o CMS. `CentralClient.tsx` é uma SPA de estado local com 4
  seções (Dashboard, Filmes, Pessoas, Posts). `FilmeForm.tsx` é o maior
  componente (~700 linhas) e, em modo edição, monta 6 painéis de tabelas
  filhas em `components/sub/`.
- `app/api/admin/` — 22 rotas REST, todas com `requireAdmin` + service role.
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

**O form oferece categorias que o banco rejeita.** A constraint
`filmes_categoria_site_check` aceita `desenvolvimento`, `pre-producao`,
`pos-producao` e `distribuicao`, e **rejeita `cinema` e `mostra`** — que o
`FilmeForm` oferece no select. Quem escolher uma das duas não consegue salvar.
Verificado por inserção direta em 06/08/2026. O conserto é decisão de
modelagem (relaxar a constraint, ou tirar as opções do form), agravada por
`/catalogo/cinema` listar **todos** os filmes sem filtrar `categoria_site`,
enquanto as páginas de etapa filtram. Perguntar antes de mexer.

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
| Retomar o Supabase | **bloqueia tudo** |
| Cadastrar os 4 secrets do repositório | keep-alive e backup nunca rodaram |
| Site URL + Redirect URLs no Supabase | Site URL aponta para o domínio `.vercel.app`; `moveofilmes.com/**` não está na allow-list. Quebra recuperação de senha por e-mail (não quebra o login) |
| Conta da cliente (`moveofilmes@gmail.com`) | na whitelist, sem conta no Auth |
| CRUD de `empresas` e `catalogo` | tabelas com dados e rota pública, sem tela no painel |
| `filmes_relacionamentos`, `pessoas_filmografias` | sem tela no painel |
| Estado do painel na URL | sem deep link; F5 volta ao dashboard; listas sem busca/filtro/paginação |
