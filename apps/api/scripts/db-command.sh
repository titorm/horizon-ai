#!/bin/bash

# Script para executar comandos Drizzle Kit com variáveis de ambiente da raiz do monorepo

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretórios
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MONO_REPO_ROOT="$(cd "$PROJECT_ROOT/../.." && pwd)"

# Carregar .env.local ou .env da raiz do monorepo
ENV_FILE="${MONO_REPO_ROOT}/.env.local"
if [ ! -f "$ENV_FILE" ]; then
    ENV_FILE="${MONO_REPO_ROOT}/.env"
fi

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ ERRO: Arquivo .env não encontrado em ${MONO_REPO_ROOT}${NC}"
    exit 1
fi

# Exportar variáveis de ambiente do arquivo .env
export $(cat "$ENV_FILE" | grep -v '^#' | xargs)

# Validar DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERRO: DATABASE_URL não está configurada${NC}"
    exit 1
fi

# Comando a executar
COMMAND=$1

case $COMMAND in
    generate)
        echo -e "${BLUE}▸${NC} Gerando migrations com Drizzle Kit..."
        cd "$MONO_REPO_ROOT"
        exec drizzle-kit generate --config ./drizzle.config.ts
        ;;
    push)
        echo -e "${BLUE}▸${NC} Aplicando migrations ao banco de dados..."
        cd "$MONO_REPO_ROOT"
        exec drizzle-kit push --config ./drizzle.config.ts
        ;;
    migrate)
        echo -e "${BLUE}▸${NC} Executando migrations..."
        cd "$MONO_REPO_ROOT"
        exec drizzle-kit migrate --config ./drizzle.config.ts
        ;;
    studio)
        echo -e "${BLUE}▸${NC} Abrindo Drizzle Studio..."
        cd "$MONO_REPO_ROOT"
        exec drizzle-kit studio --config ./drizzle.config.ts
        ;;
    drop)
        echo -e "${RED}▸${NC} Deletando banco de dados (CUIDADO!)..."
        cd "$MONO_REPO_ROOT"
        exec drizzle-kit drop --config ./drizzle.config.ts
        ;;
    *)
        echo -e "${RED}❌ Comando desconhecido: $COMMAND${NC}"
        echo ""
        echo "Comandos disponíveis:"
        echo "  generate  - Gerar novas migrations"
        echo "  push      - Aplicar migrations ao banco"
        echo "  migrate   - Executar migrations"
        echo "  studio    - Abrir Drizzle Studio"
        echo "  drop      - Deletar banco de dados"
        exit 1
        ;;
esac
