#!/bin/bash

# Script para iniciar a API Horizon AI em modo desenvolvimento

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando API Horizon AI em modo desenvolvimento...${NC}"

cd /Users/titorm/Documents/horizon-ai/apps/api

# Criar diretório de dados se não existir
mkdir -p data

# Iniciar servidor
pnpm run dev
