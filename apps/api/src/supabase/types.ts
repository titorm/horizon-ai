/**
 * Tipos gerados automaticamente pelo Supabase
 * Para regenerar: pnpm exec supabase gen types typescript --project-id [seu-projeto-id]
 *
 * Para desenvolvimento local, você pode usar este tipo genérico
 * Em produção, gere os tipos completos com a CLI do Supabase
 */

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          firstName: string | null;
          lastName: string | null;
          isActive: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          email: string;
          password: string;
          firstName?: string | null;
          lastName?: string | null;
          isActive?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password?: string;
          firstName?: string | null;
          lastName?: string | null;
          isActive?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
