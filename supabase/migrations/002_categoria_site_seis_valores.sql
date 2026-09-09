-- Migration: categoria_site passa a aceitar as seis categorias do site
-- Aplicada em produção em 09/09/2026.
--
-- Contexto — o banco discordava do resto do projeto. A constraint nasceu com
-- quatro valores (desenvolvimento, pre-producao, pos-producao, distribuicao),
-- mas o código assume seis em todo lugar:
--
--   * `HREF_TO_CAT` em `app/catalogo/page.tsx` conta as seis no índice;
--   * `app/catalogo/mostras-e-exposicoes/page.tsx` filtra por 'mostra';
--   * o select do `FilmeForm` no /central oferece as seis.
--
-- Consequências que estavam no ar: salvar um filme como "Cinema" ou "Mostras e
-- Exposições" dava erro de constraint no painel, /catalogo/mostras-e-exposicoes
-- listava zero filmes com o link vivo na navegação, e o índice do catálogo
-- somava 6 num acervo de 18.
--
-- NULL continua aceito de propósito: em 09/09/2026 doze dos dezoito filmes
-- estavam sem categoria, e classificá-los é trabalho editorial feito pelo
-- /central — não cabe a uma migração inventar categoria de filme.
--
-- Para reverter: trocar a lista de volta pelos quatro valores originais. Só é
-- possível se nenhum filme estiver em 'cinema' ou 'mostra'.

BEGIN;

ALTER TABLE filmes DROP CONSTRAINT IF EXISTS filmes_categoria_site_check;

ALTER TABLE filmes ADD CONSTRAINT filmes_categoria_site_check
  CHECK (categoria_site IN (
    'cinema',
    'mostra',
    'desenvolvimento',
    'pre-producao',
    'pos-producao',
    'distribuicao'
  ));

COMMIT;
