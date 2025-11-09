export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      catalogo: {
        Row: {
          alt_en: string | null
          alt_pt: string | null
          ano: number | null
          created_at: string
          diretores_ids: string[] | null
          empresas_ids: string[] | null
          festivais_resumo_en: string | null
          festivais_resumo_pt: string | null
          id: string
          imagem_resumo_url: string | null
          links_externos: string[] | null
          ordem: number | null
          papel_moveo: string | null
          premios_resumo_en: string | null
          premios_resumo_pt: string | null
          sinopse_curta_en: string | null
          sinopse_curta_pt: string | null
          slug: string | null
          tipo_obra: string | null
          titulo_en: string | null
          titulo_pt: string
          updated_at: string
          visibilidade: string | null
        }
        Insert: {
          alt_en?: string | null
          alt_pt?: string | null
          ano?: number | null
          created_at?: string
          diretores_ids?: string[] | null
          empresas_ids?: string[] | null
          festivais_resumo_en?: string | null
          festivais_resumo_pt?: string | null
          id?: string
          imagem_resumo_url?: string | null
          links_externos?: string[] | null
          ordem?: number | null
          papel_moveo?: string | null
          premios_resumo_en?: string | null
          premios_resumo_pt?: string | null
          sinopse_curta_en?: string | null
          sinopse_curta_pt?: string | null
          slug?: string | null
          tipo_obra?: string | null
          titulo_en?: string | null
          titulo_pt: string
          updated_at?: string
          visibilidade?: string | null
        }
        Update: {
          alt_en?: string | null
          alt_pt?: string | null
          ano?: number | null
          created_at?: string
          diretores_ids?: string[] | null
          empresas_ids?: string[] | null
          festivais_resumo_en?: string | null
          festivais_resumo_pt?: string | null
          id?: string
          imagem_resumo_url?: string | null
          links_externos?: string[] | null
          ordem?: number | null
          papel_moveo?: string | null
          premios_resumo_en?: string | null
          premios_resumo_pt?: string | null
          sinopse_curta_en?: string | null
          sinopse_curta_pt?: string | null
          slug?: string | null
          tipo_obra?: string | null
          titulo_en?: string | null
          titulo_pt?: string
          updated_at?: string
          visibilidade?: string | null
        }
        Relationships: []
      }
      empresas: {
        Row: {
          created_at: string
          descricao_curta: string | null
          email_contato: string | null
          id: string
          logo_url: string | null
          nome: string
          pais: string | null
          site_oficial: string | null
          slug: string | null
          telefone: string | null
          tipo: string | null
          updated_at: string
          visibilidade: string | null
        }
        Insert: {
          created_at?: string
          descricao_curta?: string | null
          email_contato?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          pais?: string | null
          site_oficial?: string | null
          slug?: string | null
          telefone?: string | null
          tipo?: string | null
          updated_at?: string
          visibilidade?: string | null
        }
        Update: {
          created_at?: string
          descricao_curta?: string | null
          email_contato?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          pais?: string | null
          site_oficial?: string | null
          slug?: string | null
          telefone?: string | null
          tipo?: string | null
          updated_at?: string
          visibilidade?: string | null
        }
        Relationships: []
      }
      filmes: {
        Row: {
          ano: number | null
          ano_fim: number | null
          ano_inicio: number | null
          ano_previsto: number | null
          buscando_en: string | null
          buscando_pt: string | null
          categoria_site: string | null
          classificacao_indicativa: string | null
          created_at: string
          data_lancamento_brasil: string | null
          descricao_seo_en: string | null
          descricao_seo_pt: string | null
          duracao_min: number | null
          generos: string[] | null
          id: string
          idiomas_versoes: string[] | null
          imagem_og_url: string | null
          logline_en: string | null
          logline_pt: string | null
          ordem_exibicao: number | null
          paises_producao: string[] | null
          poster_principal_url: string | null
          resumo_curto_en: string | null
          resumo_curto_pt: string | null
          sinopse_en: string | null
          sinopse_pt: string | null
          slug: string
          status_interno_en: string | null
          status_interno_pt: string | null
          tags: string[] | null
          thumbnail_card_url: string | null
          tipo_obra: string | null
          titulo_en: string | null
          titulo_pt: string
          titulo_seo_en: string | null
          titulo_seo_pt: string | null
          updated_at: string
          visibilidade: string | null
        }
        Insert: {
          ano?: number | null
          ano_fim?: number | null
          ano_inicio?: number | null
          ano_previsto?: number | null
          buscando_en?: string | null
          buscando_pt?: string | null
          categoria_site?: string | null
          classificacao_indicativa?: string | null
          created_at?: string
          data_lancamento_brasil?: string | null
          descricao_seo_en?: string | null
          descricao_seo_pt?: string | null
          duracao_min?: number | null
          generos?: string[] | null
          id?: string
          idiomas_versoes?: string[] | null
          imagem_og_url?: string | null
          logline_en?: string | null
          logline_pt?: string | null
          ordem_exibicao?: number | null
          paises_producao?: string[] | null
          poster_principal_url?: string | null
          resumo_curto_en?: string | null
          resumo_curto_pt?: string | null
          sinopse_en?: string | null
          sinopse_pt?: string | null
          slug: string
          status_interno_en?: string | null
          status_interno_pt?: string | null
          tags?: string[] | null
          thumbnail_card_url?: string | null
          tipo_obra?: string | null
          titulo_en?: string | null
          titulo_pt: string
          titulo_seo_en?: string | null
          titulo_seo_pt?: string | null
          updated_at?: string
          visibilidade?: string | null
        }
        Update: {
          ano?: number | null
          ano_fim?: number | null
          ano_inicio?: number | null
          ano_previsto?: number | null
          buscando_en?: string | null
          buscando_pt?: string | null
          categoria_site?: string | null
          classificacao_indicativa?: string | null
          created_at?: string
          data_lancamento_brasil?: string | null
          descricao_seo_en?: string | null
          descricao_seo_pt?: string | null
          duracao_min?: number | null
          generos?: string[] | null
          id?: string
          idiomas_versoes?: string[] | null
          imagem_og_url?: string | null
          logline_en?: string | null
          logline_pt?: string | null
          ordem_exibicao?: number | null
          paises_producao?: string[] | null
          poster_principal_url?: string | null
          resumo_curto_en?: string | null
          resumo_curto_pt?: string | null
          sinopse_en?: string | null
          sinopse_pt?: string | null
          slug?: string
          status_interno_en?: string | null
          status_interno_pt?: string | null
          tags?: string[] | null
          thumbnail_card_url?: string | null
          tipo_obra?: string | null
          titulo_en?: string | null
          titulo_pt?: string
          titulo_seo_en?: string | null
          titulo_seo_pt?: string | null
          updated_at?: string
          visibilidade?: string | null
        }
        Relationships: []
      }
      filmes_assets: {
        Row: {
          alt_en: string | null
          alt_pt: string | null
          created_at: string
          credito: string | null
          descricao_en: string | null
          descricao_pt: string | null
          filme_id: string
          id: string
          is_principal: boolean | null
          licenca: string | null
          ordem: number | null
          post_ids: string[] | null
          thumbnail_url: string | null
          tipo: string
          titulo_en: string | null
          titulo_pt: string | null
          updated_at: string
          url: string
          visibilidade: string | null
        }
        Insert: {
          alt_en?: string | null
          alt_pt?: string | null
          created_at?: string
          credito?: string | null
          descricao_en?: string | null
          descricao_pt?: string | null
          filme_id: string
          id?: string
          is_principal?: boolean | null
          licenca?: string | null
          ordem?: number | null
          post_ids?: string[] | null
          thumbnail_url?: string | null
          tipo: string
          titulo_en?: string | null
          titulo_pt?: string | null
          updated_at?: string
          url: string
          visibilidade?: string | null
        }
        Update: {
          alt_en?: string | null
          alt_pt?: string | null
          created_at?: string
          credito?: string | null
          descricao_en?: string | null
          descricao_pt?: string | null
          filme_id?: string
          id?: string
          is_principal?: boolean | null
          licenca?: string | null
          ordem?: number | null
          post_ids?: string[] | null
          thumbnail_url?: string | null
          tipo?: string
          titulo_en?: string | null
          titulo_pt?: string | null
          updated_at?: string
          url?: string
          visibilidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filmes_assets_filme_id_fkey"
            columns: ["filme_id"]
            isOneToOne: false
            referencedRelation: "filmes"
            referencedColumns: ["id"]
          },
        ]
      }
      filmes_creditos: {
        Row: {
          cargo: string
          created_at: string
          empresa_id: string | null
          filme_id: string
          id: string
          nome_exibicao: string | null
          ordem: number | null
          pessoa_id: string | null
          updated_at: string
          visibilidade: string | null
        }
        Insert: {
          cargo: string
          created_at?: string
          empresa_id?: string | null
          filme_id: string
          id?: string
          nome_exibicao?: string | null
          ordem?: number | null
          pessoa_id?: string | null
          updated_at?: string
          visibilidade?: string | null
        }
        Update: {
          cargo?: string
          created_at?: string
          empresa_id?: string | null
          filme_id?: string
          id?: string
          nome_exibicao?: string | null
          ordem?: number | null
          pessoa_id?: string | null
          updated_at?: string
          visibilidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filmes_creditos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filmes_creditos_filme_id_fkey"
            columns: ["filme_id"]
            isOneToOne: false
            referencedRelation: "filmes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filmes_creditos_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      filmes_elenco: {
        Row: {
          created_at: string
          descricao_curta_en: string | null
          descricao_curta_pt: string | null
          filme_id: string
          foto_url: string | null
          id: string
          ordem: number | null
          personagem: string | null
          pessoa_id: string
          updated_at: string
          visibilidade: string | null
        }
        Insert: {
          created_at?: string
          descricao_curta_en?: string | null
          descricao_curta_pt?: string | null
          filme_id: string
          foto_url?: string | null
          id?: string
          ordem?: number | null
          personagem?: string | null
          pessoa_id: string
          updated_at?: string
          visibilidade?: string | null
        }
        Update: {
          created_at?: string
          descricao_curta_en?: string | null
          descricao_curta_pt?: string | null
          filme_id?: string
          foto_url?: string | null
          id?: string
          ordem?: number | null
          personagem?: string | null
          pessoa_id?: string
          updated_at?: string
          visibilidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filmes_elenco_filme_id_fkey"
            columns: ["filme_id"]
            isOneToOne: false
            referencedRelation: "filmes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filmes_elenco_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      filmes_festivais: {
        Row: {
          ano: number | null
          cidade: string | null
          created_at: string
          edicao: string | null
          filme_id: string
          id: string
          nome: string
          observacoes: string | null
          ordem: number | null
          pais: string | null
          secao: string | null
          tipo_estreia: string | null
          tipo_evento: string | null
          updated_at: string
          visibilidade: string | null
        }
        Insert: {
          ano?: number | null
          cidade?: string | null
          created_at?: string
          edicao?: string | null
          filme_id: string
          id?: string
          nome: string
          observacoes?: string | null
          ordem?: number | null
          pais?: string | null
          secao?: string | null
          tipo_estreia?: string | null
          tipo_evento?: string | null
          updated_at?: string
          visibilidade?: string | null
        }
        Update: {
          ano?: number | null
          cidade?: string | null
          created_at?: string
          edicao?: string | null
          filme_id?: string
          id?: string
          nome?: string
          observacoes?: string | null
          ordem?: number | null
          pais?: string | null
          secao?: string | null
          tipo_estreia?: string | null
          tipo_evento?: string | null
          updated_at?: string
          visibilidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filmes_festivais_filme_id_fkey"
            columns: ["filme_id"]
            isOneToOne: false
            referencedRelation: "filmes"
            referencedColumns: ["id"]
          },
        ]
      }
      filmes_financiamentos: {
        Row: {
          ano: number | null
          created_at: string
          fase: string | null
          filme_id: string
          id: string
          moeda: string | null
          nome: string
          observacoes: string | null
          ordem: number | null
          organizador: string | null
          resultado: string | null
          tipo: string
          updated_at: string
          valor: number | null
          visibilidade: string | null
        }
        Insert: {
          ano?: number | null
          created_at?: string
          fase?: string | null
          filme_id: string
          id?: string
          moeda?: string | null
          nome: string
          observacoes?: string | null
          ordem?: number | null
          organizador?: string | null
          resultado?: string | null
          tipo: string
          updated_at?: string
          valor?: number | null
          visibilidade?: string | null
        }
        Update: {
          ano?: number | null
          created_at?: string
          fase?: string | null
          filme_id?: string
          id?: string
          moeda?: string | null
          nome?: string
          observacoes?: string | null
          ordem?: number | null
          organizador?: string | null
          resultado?: string | null
          tipo?: string
          updated_at?: string
          valor?: number | null
          visibilidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filmes_financiamentos_filme_id_fkey"
            columns: ["filme_id"]
            isOneToOne: false
            referencedRelation: "filmes"
            referencedColumns: ["id"]
          },
        ]
      }
      filmes_premiacoes: {
        Row: {
          ano: number | null
          categoria: string | null
          created_at: string
          festival_id: string | null
          festival_nome: string | null
          filme_id: string
          id: string
          observacoes: string | null
          ordem: number | null
          tipo: string | null
          titulo_do_premio: string
          updated_at: string
          visibilidade: string | null
        }
        Insert: {
          ano?: number | null
          categoria?: string | null
          created_at?: string
          festival_id?: string | null
          festival_nome?: string | null
          filme_id: string
          id?: string
          observacoes?: string | null
          ordem?: number | null
          tipo?: string | null
          titulo_do_premio: string
          updated_at?: string
          visibilidade?: string | null
        }
        Update: {
          ano?: number | null
          categoria?: string | null
          created_at?: string
          festival_id?: string | null
          festival_nome?: string | null
          filme_id?: string
          id?: string
          observacoes?: string | null
          ordem?: number | null
          tipo?: string | null
          titulo_do_premio?: string
          updated_at?: string
          visibilidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filmes_premiacoes_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "filmes_festivais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filmes_premiacoes_filme_id_fkey"
            columns: ["filme_id"]
            isOneToOne: false
            referencedRelation: "filmes"
            referencedColumns: ["id"]
          },
        ]
      }
      filmes_relacionamentos: {
        Row: {
          created_at: string
          filme_id_origem: string
          filme_id_relacionado: string
          id: string
          observacoes: string | null
          ordem: number | null
          tipo_relacao: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          filme_id_origem: string
          filme_id_relacionado: string
          id?: string
          observacoes?: string | null
          ordem?: number | null
          tipo_relacao: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          filme_id_origem?: string
          filme_id_relacionado?: string
          id?: string
          observacoes?: string | null
          ordem?: number | null
          tipo_relacao?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "filmes_relacionamentos_filme_id_origem_fkey"
            columns: ["filme_id_origem"]
            isOneToOne: false
            referencedRelation: "filmes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filmes_relacionamentos_filme_id_relacionado_fkey"
            columns: ["filme_id_relacionado"]
            isOneToOne: false
            referencedRelation: "filmes"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoas: {
        Row: {
          areas_atuacao: string[] | null
          bio_en: string | null
          bio_pt: string | null
          created_at: string
          foto_url: string | null
          id: string
          links: string[] | null
          nome: string
          nome_exibicao: string | null
          slug: string | null
          updated_at: string
          visibilidade: string | null
        }
        Insert: {
          areas_atuacao?: string[] | null
          bio_en?: string | null
          bio_pt?: string | null
          created_at?: string
          foto_url?: string | null
          id?: string
          links?: string[] | null
          nome: string
          nome_exibicao?: string | null
          slug?: string | null
          updated_at?: string
          visibilidade?: string | null
        }
        Update: {
          areas_atuacao?: string[] | null
          bio_en?: string | null
          bio_pt?: string | null
          created_at?: string
          foto_url?: string | null
          id?: string
          links?: string[] | null
          nome?: string
          nome_exibicao?: string | null
          slug?: string | null
          updated_at?: string
          visibilidade?: string | null
        }
        Relationships: []
      }
      pessoas_filmografias: {
        Row: {
          ano: number | null
          created_at: string
          duracao_min: number | null
          filme_id: string | null
          funcao: string | null
          id: string
          observacoes: string | null
          ordem: number | null
          pessoa_id: string
          tipo_obra: string | null
          titulo_en: string | null
          titulo_pt: string
          updated_at: string
        }
        Insert: {
          ano?: number | null
          created_at?: string
          duracao_min?: number | null
          filme_id?: string | null
          funcao?: string | null
          id?: string
          observacoes?: string | null
          ordem?: number | null
          pessoa_id: string
          tipo_obra?: string | null
          titulo_en?: string | null
          titulo_pt: string
          updated_at?: string
        }
        Update: {
          ano?: number | null
          created_at?: string
          duracao_min?: number | null
          filme_id?: string | null
          funcao?: string | null
          id?: string
          observacoes?: string | null
          ordem?: number | null
          pessoa_id?: string
          tipo_obra?: string | null
          titulo_en?: string | null
          titulo_pt?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pessoas_filmografias_filme_id_fkey"
            columns: ["filme_id"]
            isOneToOne: false
            referencedRelation: "filmes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_filmografias_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          alt_en: string | null
          alt_pt: string | null
          atualizado_em: string | null
          conteudo_en: string | null
          conteudo_pt: string | null
          created_at: string
          filmes_ids: string[] | null
          id: string
          imagem_capa_url: string | null
          publicado_em: string | null
          resumo_en: string | null
          resumo_pt: string | null
          slug: string
          tipo: string | null
          titulo_en: string | null
          titulo_pt: string
          updated_at: string
          url_externa: string | null
          visibilidade: string | null
        }
        Insert: {
          alt_en?: string | null
          alt_pt?: string | null
          atualizado_em?: string | null
          conteudo_en?: string | null
          conteudo_pt?: string | null
          created_at?: string
          filmes_ids?: string[] | null
          id?: string
          imagem_capa_url?: string | null
          publicado_em?: string | null
          resumo_en?: string | null
          resumo_pt?: string | null
          slug: string
          tipo?: string | null
          titulo_en?: string | null
          titulo_pt: string
          updated_at?: string
          url_externa?: string | null
          visibilidade?: string | null
        }
        Update: {
          alt_en?: string | null
          alt_pt?: string | null
          atualizado_em?: string | null
          conteudo_en?: string | null
          conteudo_pt?: string | null
          created_at?: string
          filmes_ids?: string[] | null
          id?: string
          imagem_capa_url?: string | null
          publicado_em?: string | null
          resumo_en?: string | null
          resumo_pt?: string | null
          slug?: string
          tipo?: string | null
          titulo_en?: string | null
          titulo_pt?: string
          updated_at?: string
          url_externa?: string | null
          visibilidade?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

