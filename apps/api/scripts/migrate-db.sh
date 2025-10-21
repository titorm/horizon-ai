#!/bin/bash

# Script de Migração Drizzle para PostgreSQL
# Uso: ./scripts/migrate-db.sh [environment] [action]
# Ambientes: local, staging, production
# Ações: generate, push, migrate, studio, rollback, status

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API_DIR="$PROJECT_ROOT"
MIGRATIONS_DIR="$API_DIR/src/database/migrations"
ENV_FILE="$API_DIR/.env"
BACKUP_DIR="$API_DIR/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# ============================================================================
# FUNÇÕES UTILITÁRIAS
# ============================================================================

log_info() {
    echo -e "${BLUE}ℹ️  INFO:${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ SUCCESS:${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠️  WARNING:${NC} $1"
}

log_error() {
    echo -e "${RED}❌ ERROR:${NC} $1"
}

print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  $1"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
}

# Verificar se arquivo .env existe
check_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        log_error ".env não encontrado em $ENV_FILE"
        log_info "Criar .env baseado em .env.example:"
        log_info "cp $API_DIR/.env.example $ENV_FILE"
        exit 1
    fi
}

# Verificar se DATABASE_URL está configurada
check_database_url() {
    if ! grep -q "DATABASE_URL" "$ENV_FILE"; then
        log_error "DATABASE_URL não configurada em .env"
        exit 1
    fi
    
    DATABASE_URL=$(grep "^DATABASE_URL=" "$ENV_FILE" | cut -d '=' -f 2-)
    if [ -z "$DATABASE_URL" ]; then
        log_error "DATABASE_URL está vazia"
        exit 1
    fi
    
    log_success "DATABASE_URL configurada"
}

# Testar conexão com banco
test_connection() {
    log_info "Testando conexão com banco de dados..."
    
    if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
        log_success "Conexão com banco de dados bem-sucedida"
        return 0
    else
        log_error "Falha ao conectar ao banco de dados"
        log_info "Verifique DATABASE_URL: $DATABASE_URL"
        return 1
    fi
}

# Criar backup do banco
backup_database() {
    log_info "Criando backup do banco de dados..."
    
    mkdir -p "$BACKUP_DIR"
    
    BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"
    
    if pg_dump "$DATABASE_URL" > "$BACKUP_FILE"; then
        log_success "Backup criado: $BACKUP_FILE"
        echo "$BACKUP_FILE"
    else
        log_error "Falha ao criar backup"
        return 1
    fi
}

# Listar migrations
list_migrations() {
    log_info "Migrations disponíveis:"
    echo ""
    
    if [ ! -d "$MIGRATIONS_DIR" ]; then
        log_warning "Pasta de migrations não encontrada"
        return 1
    fi
    
    local count=0
    for file in "$MIGRATIONS_DIR"/*.sql; do
        if [ -f "$file" ]; then
            local filename=$(basename "$file")
            local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            printf "  ${BLUE}▸${NC} %-50s (%s bytes)\n" "$filename" "$size"
            ((count++))
        fi
    done
    
    if [ $count -eq 0 ]; then
        log_warning "Nenhuma migration encontrada"
    else
        echo ""
        echo "Total: $count migrations"
    fi
}

# ============================================================================
# AÇÕES PRINCIPAIS
# ============================================================================

# Gerar nova migration
action_generate() {
    print_header "Gerando Nova Migration"
    
    check_env_file
    
    log_info "Executando: drizzle-kit generate"
    
    cd "$PROJECT_ROOT"
    npx drizzle-kit generate
    
    if [ $? -eq 0 ]; then
        log_success "Migration gerada com sucesso"
        log_info "Próximo passo: verificar arquivo SQL em $MIGRATIONS_DIR"
        log_info "Depois execute: pnpm db:push"
    else
        log_error "Falha ao gerar migration"
        exit 1
    fi
}

# Aplicar migrations (push)
action_push() {
    print_header "Aplicando Migrations ao Banco de Dados"
    
    check_env_file
    check_database_url
    
    if ! test_connection; then
        exit 1
    fi
    
    # Criar backup antes de aplicar
    log_warning "Criando backup antes de aplicar migrations..."
    BACKUP_FILE=$(backup_database)
    
    log_info "Executando: drizzle-kit push:pg"
    
    cd "$PROJECT_ROOT"
    npx drizzle-kit push:pg
    
    if [ $? -eq 0 ]; then
        log_success "Migrations aplicadas com sucesso"
        log_info "Backup salvo em: $BACKUP_FILE"
    else
        log_error "Falha ao aplicar migrations"
        log_warning "Backup disponível em: $BACKUP_FILE"
        exit 1
    fi
}

# Migrar com drizzle-kit migrate
action_migrate() {
    print_header "Migrando com Drizzle Kit"
    
    check_env_file
    check_database_url
    
    if ! test_connection; then
        exit 1
    fi
    
    log_warning "Criando backup antes de migrar..."
    BACKUP_FILE=$(backup_database)
    
    log_info "Executando: drizzle-kit migrate:pg"
    
    cd "$PROJECT_ROOT"
    npx drizzle-kit migrate:pg
    
    if [ $? -eq 0 ]; then
        log_success "Migrations executadas com sucesso"
        log_info "Backup salvo em: $BACKUP_FILE"
    else
        log_error "Falha ao executar migrations"
        log_warning "Backup disponível em: $BACKUP_FILE"
        exit 1
    fi
}

# Abrir Drizzle Studio
action_studio() {
    print_header "Abrindo Drizzle Studio"
    
    check_env_file
    check_database_url
    
    if ! test_connection; then
        exit 1
    fi
    
    log_info "Iniciando Drizzle Studio..."
    log_info "Interface visual estará disponível em http://localhost:3000"
    
    cd "$PROJECT_ROOT"
    npx drizzle-kit studio
}

# Listar status das migrations
action_status() {
    print_header "Status das Migrations"
    
    check_env_file
    check_database_url
    
    if ! test_connection; then
        exit 1
    fi
    
    log_info "Migrations geradas localmente:"
    list_migrations
    
    echo ""
    log_info "Para ver quais foram aplicadas ao banco, abra:"
    log_info "pnpm db:studio"
}

# Fazer rollback (restaurar de backup)
action_rollback() {
    print_header "Rollback de Migrations"
    
    check_env_file
    check_database_url
    
    if ! test_connection; then
        exit 1
    fi
    
    # Listar backups disponíveis
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR)" ]; then
        log_error "Nenhum backup encontrado em $BACKUP_DIR"
        exit 1
    fi
    
    echo ""
    log_info "Backups disponíveis:"
    echo ""
    
    local backups=($(ls -t "$BACKUP_DIR"/*.sql 2>/dev/null))
    
    for i in "${!backups[@]}"; do
        printf "  ${BLUE}[$((i+1))${NC}] %s\n" "$(basename "${backups[$i]}")"
    done
    
    echo ""
    read -p "Escolha o backup para restaurar (número): " backup_choice
    
    if [ -z "$backup_choice" ] || [ "$backup_choice" -lt 1 ] || [ "$backup_choice" -gt "${#backups[@]}" ]; then
        log_error "Escolha inválida"
        exit 1
    fi
    
    RESTORE_FILE="${backups[$((backup_choice-1))]}"
    
    log_warning "Restaurando de: $(basename $RESTORE_FILE)"
    read -p "Tem certeza? Digite 'SIM' para confirmar: " confirm
    
    if [ "$confirm" != "SIM" ]; then
        log_info "Operação cancelada"
        exit 0
    fi
    
    log_info "Restaurando banco de dados..."
    
    # Criar nova conexão sem banco específico para dropar o banco
    DB_URL_WITHOUT_DB=$(echo "$DATABASE_URL" | sed 's/\/[^/]*$/\/postgres/')
    
    if psql "$DB_URL_WITHOUT_DB" -c "DROP DATABASE IF EXISTS horizon_ai;" && \
       createdb -h $(echo "$DATABASE_URL" | sed 's/.*@\([^:]*\).*/\1/') -p $(echo "$DATABASE_URL" | sed 's/.*:\([0-9]*\)\/.*/\1/') -U $(echo "$DATABASE_URL" | sed 's/.*:\/\/\([^:]*\).*/\1/') horizon_ai && \
       psql "$DATABASE_URL" < "$RESTORE_FILE"; then
        log_success "Banco de dados restaurado com sucesso"
    else
        log_error "Falha ao restaurar banco de dados"
        exit 1
    fi
}

# Resetar banco (deletar tudo e recriar)
action_reset() {
    print_header "Resetar Banco de Dados"
    
    check_env_file
    check_database_url
    
    if ! test_connection; then
        exit 1
    fi
    
    log_warning "⚠️  AÇÃO DESTRUTIVA: Todas as tabelas e dados serão deletados!"
    read -p "Digite 'RESETAR' para confirmar: " confirm
    
    if [ "$confirm" != "RESETAR" ]; then
        log_info "Operação cancelada"
        exit 0
    fi
    
    log_warning "Criando backup de segurança..."
    BACKUP_FILE=$(backup_database)
    log_success "Backup criado: $BACKUP_FILE"
    
    log_info "Deletando banco de dados..."
    
    if npx drizzle-kit drop; then
        log_success "Banco resetado com sucesso"
        log_info "Agora execute: pnpm db:push"
        log_info "Backup salvo em: $BACKUP_FILE"
    else
        log_error "Falha ao resetar banco"
        exit 1
    fi
}

# Sincronizar schema (push sem confirmar)
action_sync() {
    print_header "Sincronizar Schema com Banco"
    
    check_env_file
    check_database_url
    
    if ! test_connection; then
        exit 1
    fi
    
    log_info "Sincronizando schema TypeScript com banco PostgreSQL..."
    
    cd "$PROJECT_ROOT"
    npx drizzle-kit push:pg --no-prompt
    
    if [ $? -eq 0 ]; then
        log_success "Schema sincronizado com sucesso"
    else
        log_error "Falha ao sincronizar schema"
        exit 1
    fi
}

# ============================================================================
# HELP E MAIN
# ============================================================================

show_help() {
    cat << EOF
╔════════════════════════════════════════════════════════════════╗
║   Drizzle ORM - PostgreSQL Migration Script                   ║
║   Para gerenciar migrations do banco de dados                 ║
╚════════════════════════════════════════════════════════════════╝

USO:
  ./scripts/migrate-db.sh [ação] [opções]

AÇÕES DISPONÍVEIS:

  ${BLUE}generate${NC}     Gerar nova migration baseada no schema.ts
  ${BLUE}push${NC}        Aplicar migrations ao banco (com backup)
  ${BLUE}migrate${NC}     Executar migrations com drizzle-kit
  ${BLUE}sync${NC}        Sincronizar schema com banco
  ${BLUE}studio${NC}      Abrir Drizzle Studio (UI visual)
  ${BLUE}status${NC}      Verificar status das migrations
  ${BLUE}rollback${NC}    Restaurar de um backup anterior
  ${BLUE}reset${NC}       ⚠️  Deletar tudo e recriar (CUIDADO!)
  ${BLUE}help${NC}        Exibir esta mensagem

EXEMPLOS:

  # Gerar nova migration
  ./scripts/migrate-db.sh generate

  # Aplicar migrations ao banco
  ./scripts/migrate-db.sh push

  # Ver status
  ./scripts/migrate-db.sh status

  # Abrir UI visual
  ./scripts/migrate-db.sh studio

  # Restaurar de backup
  ./scripts/migrate-db.sh rollback

CONFIGURAÇÃO:

  1. Configure DATABASE_URL em apps/api/.env
  2. Execute: ./scripts/migrate-db.sh push

BACKUPS:

  Backups são salvos em: ./backups/
  Restaure com: ./scripts/migrate-db.sh rollback

TROUBLESHOOTING:

  ❌ "DATABASE_URL não configurada"
     → Configure em apps/api/.env

  ❌ "Falha ao conectar ao banco"
     → Verifique se PostgreSQL está rodando
     → Verifique DATABASE_URL

  ❌ "psql: command not found"
     → Instale PostgreSQL client:
        macOS: brew install postgresql
        Ubuntu: apt-get install postgresql-client

VARIÁVEIS DE AMBIENTE:

  DATABASE_URL       URL de conexão PostgreSQL (obrigatória)
  NODE_ENV           development|staging|production

LINKS ÚTEIS:

  Documentação Drizzle: https://orm.drizzle.team
  Documentação PostgreSQL: https://www.postgresql.org/docs
  Setup Guide: ../DRIZZLE_SETUP.md

EOF
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    local action="${1:-help}"
    
    case "$action" in
        generate)
            action_generate
            ;;
        push)
            action_push
            ;;
        migrate)
            action_migrate
            ;;
        studio)
            action_studio
            ;;
        status)
            action_status
            ;;
        rollback)
            action_rollback
            ;;
        reset)
            action_reset
            ;;
        sync)
            action_sync
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Ação desconhecida: $action"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Executar main
main "$@"
