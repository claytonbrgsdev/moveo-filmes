/**
 * Type helpers for Supabase Database
 * 
 * Exemplos de uso:
 * 
 * import type { FilmeRow, FilmeInsert, FilmeUpdate } from '@/lib/supabase/types'
 * 
 * const filme: FilmeRow = { ... }
 * const novoFilme: FilmeInsert = { ... }
 * const atualizacao: FilmeUpdate = { ... }
 */

import type { Tables, TablesInsert, TablesUpdate } from './database.types'

// Filmes
export type FilmeRow = Tables<'filmes'>
export type FilmeInsert = TablesInsert<'filmes'>
export type FilmeUpdate = TablesUpdate<'filmes'>

// Posts
export type PostRow = Tables<'posts'>
export type PostInsert = TablesInsert<'posts'>
export type PostUpdate = TablesUpdate<'posts'>

// Pessoas
export type PessoaRow = Tables<'pessoas'>
export type PessoaInsert = TablesInsert<'pessoas'>
export type PessoaUpdate = TablesUpdate<'pessoas'>

// Empresas
export type EmpresaRow = Tables<'empresas'>
export type EmpresaInsert = TablesInsert<'empresas'>
export type EmpresaUpdate = TablesUpdate<'empresas'>

// Catálogo
export type CatalogoRow = Tables<'catalogo'>
export type CatalogoInsert = TablesInsert<'catalogo'>
export type CatalogoUpdate = TablesUpdate<'catalogo'>

// Filmes Assets
export type FilmeAssetRow = Tables<'filmes_assets'>
export type FilmeAssetInsert = TablesInsert<'filmes_assets'>
export type FilmeAssetUpdate = TablesUpdate<'filmes_assets'>

// Filmes Créditos
export type FilmeCreditoRow = Tables<'filmes_creditos'>
export type FilmeCreditoInsert = TablesInsert<'filmes_creditos'>
export type FilmeCreditoUpdate = TablesUpdate<'filmes_creditos'>

// Filmes Elenco
export type FilmeElencoRow = Tables<'filmes_elenco'>
export type FilmeElencoInsert = TablesInsert<'filmes_elenco'>
export type FilmeElencoUpdate = TablesUpdate<'filmes_elenco'>

// Filmes Festivais
export type FilmeFestivalRow = Tables<'filmes_festivais'>
export type FilmeFestivalInsert = TablesInsert<'filmes_festivais'>
export type FilmeFestivalUpdate = TablesUpdate<'filmes_festivais'>

// Filmes Financiamentos
export type FilmeFinanciamentoRow = Tables<'filmes_financiamentos'>
export type FilmeFinanciamentoInsert = TablesInsert<'filmes_financiamentos'>
export type FilmeFinanciamentoUpdate = TablesUpdate<'filmes_financiamentos'>

// Filmes Premiações
export type FilmePremiacaoRow = Tables<'filmes_premiacoes'>
export type FilmePremiacaoInsert = TablesInsert<'filmes_premiacoes'>
export type FilmePremiacaoUpdate = TablesUpdate<'filmes_premiacoes'>

// Filmes Relacionamentos
export type FilmeRelacionamentoRow = Tables<'filmes_relacionamentos'>
export type FilmeRelacionamentoInsert = TablesInsert<'filmes_relacionamentos'>
export type FilmeRelacionamentoUpdate = TablesUpdate<'filmes_relacionamentos'>

// Pessoas Filmografias
export type PessoaFilmografiaRow = Tables<'pessoas_filmografias'>
export type PessoaFilmografiaInsert = TablesInsert<'pessoas_filmografias'>
export type PessoaFilmografiaUpdate = TablesUpdate<'pessoas_filmografias'>

