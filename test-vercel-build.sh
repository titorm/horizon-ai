#!/bin/bash

# Script para testar o build antes do deploy no Vercel
# Uso: ./test-vercel-build.sh

echo "🧪 Testando build do Vercel localmente..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verifica se está no diretório correto
if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ Erro: vercel.json não encontrado${NC}"
    echo "Execute este script no diretório root do projeto"
    exit 1
fi

echo -e "${YELLOW}📦 Instalando dependências...${NC}"
pnpm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔨 Building frontend (apps/web)...${NC}"
cd apps/web
pnpm build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no build do frontend${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
echo ""
echo -e "${YELLOW}📂 Diretório de output:${NC} apps/web/dist"
echo ""
echo -e "${YELLOW}🚀 Preview local:${NC}"
echo "   cd apps/web && pnpm preview"
echo ""
echo -e "${GREEN}✨ Pronto para deploy no Vercel!${NC}"
