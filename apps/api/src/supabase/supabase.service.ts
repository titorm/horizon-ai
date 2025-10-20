import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { PostgrestQueryBuilder } from '@supabase/postgrest-js';

/**
 * Supabase Service - Gerencia a conexão e operações com Supabase PostgreSQL
 *
 * Utiliza o cliente oficial @supabase/supabase-js para operações no banco de dados
 * Todas as operações de banco são feitas através deste serviço (sem TypeORM)
 */
@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase!: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('SUPABASE_URL or SUPABASE_KEY not defined in environment');
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase client initialized successfully');
  }

  /**
   * Retorna o cliente Supabase configurado
   */
  getClient(): SupabaseClient {
    return this.supabase;
  }

  /**
   * Acessa a tabela de usuários
   */
  getUsersTable(): PostgrestQueryBuilder<any, any, any, any> {
    return this.supabase.from('users');
  }
}
