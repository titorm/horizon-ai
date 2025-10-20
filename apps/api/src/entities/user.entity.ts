/**
 * Interface do Usuário
 *
 * No lugar de usar TypeORM, usamos uma interface TypeScript simples
 * Os dados são obtidos diretamente do Supabase PostgreSQL
 */

export interface User {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
