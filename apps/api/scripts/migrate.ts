#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

// ============================================================================
// Configuração
// ============================================================================

const projectRoot = path.resolve(__dirname, '..');
const envFile = path.join(projectRoot, '.env');
const migrationsDir = path.join(projectRoot, 'src', 'database', 'migrations');
const backupsDir = path.join(projectRoot, 'backups');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// ============================================================================
// Funções Utilitárias
// ============================================================================

function log(type: 'info' | 'success' | 'warning' | 'error', message: string) {
  const icons = {
    info: 'ℹ️ ',
    success: '✅',
    warning: '⚠️ ',
    error: '❌',
  };

  const colorCodes = {
    info: colors.blue,
    success: colors.green,
    warning: colors.yellow,
    error: colors.red,
  };

  const timestamp = new Date().toLocaleTimeString();
  console.log(
    `${colorCodes[type]}${icons[type]} [${timestamp}] ${type.toUpperCase()}: ${message}${colors.reset}`,
  );
}

function loadEnv() {
  if (!fs.existsSync(envFile)) {
    log('error', `.env não encontrado em ${envFile}`);
    process.exit(1);
  }

  dotenv.config({ path: envFile });

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    log('error', 'DATABASE_URL não está configurada em .env');
    process.exit(1);
  }

  return databaseUrl;
}

function testConnection(databaseUrl: string): boolean {
  try {
    log('info', 'Testando conexão com banco de dados...');
    execSync(`psql "${databaseUrl}" -c "SELECT 1"`, {
      stdio: 'pipe',
      cwd: projectRoot,
    });
    log('success', 'Conexão com banco estabelecida');
    return true;
  } catch (error) {
    log('error', 'Falha ao conectar ao banco de dados');
    log('info', `DATABASE_URL: ${databaseUrl.split('@')[1] || 'invalid'}`);
    return false;
  }
}

function createBackup(databaseUrl: string): string {
  try {
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const backupFile = path.join(backupsDir, `backup_${timestamp}.sql`);
    log('info', 'Criando backup do banco de dados...');

    execSync(`pg_dump "${databaseUrl}" > "${backupFile}"`, {
      cwd: projectRoot,
    });

    log('success', `Backup criado: ${backupFile}`);
    return backupFile;
  } catch (error) {
    log('error', 'Falha ao criar backup');
    throw error;
  }
}

function listMigrations(): number {
  if (!fs.existsSync(migrationsDir)) {
    log('warning', 'Pasta de migrations não encontrada');
    return 0;
  }

  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));

  if (files.length === 0) {
    log('warning', 'Nenhuma migration encontrada');
    return 0;
  }

  log('info', 'Migrations disponíveis:');
  console.log('');

  files.forEach((file, index) => {
    const filePath = path.join(migrationsDir, file);
    const stats = fs.statSync(filePath);
    console.log(
      `  ${colors.blue}▸${colors.reset} ${file.padEnd(50)} (${stats.size} bytes)`,
    );
  });

  console.log('');
  console.log(`Total: ${files.length} migrations`);
  console.log('');

  return files.length;
}

function runCommand(command: string, description: string): boolean {
  try {
    log('info', description);
    execSync(command, {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    return true;
  } catch (error) {
    log('error', `${description} falhou`);
    return false;
  }
}

// ============================================================================
// Ações
// ============================================================================

async function actionGenerate(): Promise<void> {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  Gerando Nova Migration                                        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  if (!runCommand('pnpm db:generate', 'Gerando migration com Drizzle Kit')) {
    process.exit(1);
  }

  log('success', 'Migration gerada com sucesso');
  log('info', `Verifique: ${migrationsDir}`);
  log('info', 'Próximo passo: pnpm migrate:push');
}

async function actionPush(databaseUrl: string): Promise<void> {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  Aplicando Migrations ao Banco de Dados                        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  if (!testConnection(databaseUrl)) {
    process.exit(1);
  }

  const backupFile = createBackup(databaseUrl);
  console.log('');

  if (!runCommand('pnpm db:push', 'Aplicando migrations')) {
    log('warning', `Backup disponível em: ${backupFile}`);
    process.exit(1);
  }

  log('success', 'Migrations aplicadas com sucesso');
  log('info', `Backup salvo em: ${backupFile}`);
}

async function actionMigrate(databaseUrl: string): Promise<void> {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  Executando Migrations com Drizzle Kit                         ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  if (!testConnection(databaseUrl)) {
    process.exit(1);
  }

  const backupFile = createBackup(databaseUrl);
  console.log('');

  if (!runCommand('pnpm db:migrate', 'Executando migrations')) {
    log('warning', `Backup disponível em: ${backupFile}`);
    process.exit(1);
  }

  log('success', 'Migrations executadas com sucesso');
  log('info', `Backup salvo em: ${backupFile}`);
}

async function actionStudio(databaseUrl: string): Promise<void> {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  Abrindo Drizzle Studio                                        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  if (!testConnection(databaseUrl)) {
    process.exit(1);
  }

  log('info', 'Iniciando Drizzle Studio...');
  log('info', 'Interface visual disponível em: http://localhost:3000');
  console.log('');

  runCommand('pnpm db:studio', 'Abrindo Studio');
}

async function actionStatus(databaseUrl: string): Promise<void> {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  Status das Migrations                                         ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  if (!testConnection(databaseUrl)) {
    process.exit(1);
  }

  log('info', 'Migrations geradas localmente:');
  console.log('');
  listMigrations();

  log('info', 'Para ver quais foram aplicadas ao banco:');
  log('info', 'Execute: pnpm migrate:studio');
}

async function actionReset(databaseUrl: string): Promise<void> {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ⚠️  RESETAR BANCO DE DADOS                                    ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  if (!testConnection(databaseUrl)) {
    process.exit(1);
  }

  log('warning', 'AÇÃO DESTRUTIVA: Todas as tabelas e dados serão deletados!');

  const answer = await new Promise<string>((resolve) => {
    process.stdout.write(
      `${colors.yellow}⚠️  Digite 'RESETAR' para confirmar: ${colors.reset}`,
    );
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });

  if (answer !== 'RESETAR') {
    log('info', 'Operação cancelada');
    process.exit(0);
  }

  const backupFile = createBackup(databaseUrl);
  console.log('');

  if (!runCommand('pnpm db:drop', 'Deletando banco de dados')) {
    log('warning', `Backup disponível em: ${backupFile}`);
    process.exit(1);
  }

  log('success', 'Banco de dados resetado');
  log('info', `Backup salvo em: ${backupFile}`);
  log('info', 'Execute: pnpm migrate:push');
}

function showHelp(): void {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║   Drizzle ORM - PostgreSQL Migration Script (TypeScript)      ║
║   Para gerenciar migrations do banco de dados                 ║
╚════════════════════════════════════════════════════════════════╝

${colors.blue}USO:${colors.reset}
  pnpm migrate [ação]

${colors.blue}AÇÕES DISPONÍVEIS:${colors.reset}

  generate    Gerar nova migration baseada no schema.ts
  push        Aplicar migrations ao banco (com backup)
  migrate     Executar migrations com drizzle-kit
  studio      Abrir Drizzle Studio (UI visual)
  status      Verificar status das migrations
  reset       ⚠️  Deletar tudo e recriar (CUIDADO!)
  help        Exibir esta mensagem

${colors.blue}EXEMPLOS:${colors.reset}

  # Gerar nova migration
  pnpm migrate generate

  # Aplicar migrations ao banco
  pnpm migrate push

  # Ver status
  pnpm migrate status

  # Abrir UI visual
  pnpm migrate studio

${colors.blue}CONFIGURAÇÃO:${colors.reset}

  1. Configure DATABASE_URL em .env
  2. Execute: pnpm migrate push

${colors.blue}TROUBLESHOOTING:${colors.reset}

  ❌ "DATABASE_URL não configurada"
     → Configure em apps/api/.env

  ❌ "Falha ao conectar ao banco"
     → Verifique se PostgreSQL está rodando
     → Verifique DATABASE_URL

  ❌ "psql: command not found"
     → Instale PostgreSQL client:
        macOS: brew install postgresql
        Ubuntu: apt-get install postgresql-client

${colors.blue}LINKS ÚTEIS:${colors.reset}

  Documentação Drizzle: https://orm.drizzle.team
  Documentação PostgreSQL: https://www.postgresql.org/docs
  Setup Guide: ./DRIZZLE_SETUP.md

`);
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  const action = process.argv[2] || 'help';
  const databaseUrl = action !== 'help' ? loadEnv() : '';

  try {
    switch (action) {
      case 'generate':
        await actionGenerate();
        break;
      case 'push':
        await actionPush(databaseUrl);
        break;
      case 'migrate':
        await actionMigrate(databaseUrl);
        break;
      case 'studio':
        await actionStudio(databaseUrl);
        break;
      case 'status':
        await actionStatus(databaseUrl);
        break;
      case 'reset':
        await actionReset(databaseUrl);
        break;
      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;
      default:
        log('error', `Ação desconhecida: ${action}`);
        console.log('');
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    log('error', 'Erro ao executar ação');
    console.error(error);
    process.exit(1);
  }
}

main();
