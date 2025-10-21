#!/bin/bash

# Script para testar setup de banco de dados

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Teste de Setup do Banco de Dados                           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Verificar .env.local
echo -e "${YELLOW}[1]${NC} Procurando arquivo .env.local..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local encontrado"
else
    echo -e "${RED}✗${NC} .env.local não encontrado"
    echo "   Execute: cp .env.example .env.local"
    exit 1
fi

# 2. Verificar DATABASE_URL
echo ""
echo -e "${YELLOW}[2]${NC} Verificando DATABASE_URL..."
if grep -q "^DATABASE_URL=" .env.local; then
    DB_URL=$(grep "^DATABASE_URL=" .env.local | cut -d'=' -f2)
    echo -e "${GREEN}✓${NC} DATABASE_URL configurada"
    echo "   Banco: $(echo $DB_URL | cut -d'@' -f2 | cut -d':' -f1)"
else
    echo -e "${RED}✗${NC} DATABASE_URL não está configurada"
    exit 1
fi

# 3. Verificar psql
echo ""
echo -e "${YELLOW}[3]${NC} Verificando cliente PostgreSQL (psql)..."
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓${NC} psql instalado"
else
    echo -e "${YELLOW}⚠${NC}  psql não encontrado (opcional)"
fi

# 4. Testar conexão (se possível)
echo ""
echo -e "${YELLOW}[4]${NC} Testando conexão com banco de dados..."
if psql "$DB_URL" -c "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✓${NC} Conexão com banco de dados estabelecida"
    
    # 5. Verificar tabelas existentes
    echo ""
    echo -e "${YELLOW}[5]${NC} Tabelas existentes no banco:"
    psql "$DB_URL" -c "
        SELECT 
            schemaname,
            tablename 
        FROM pg_tables 
        WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
        ORDER BY tablename;
    "
else
    echo -e "${YELLOW}⚠${NC}  Não foi possível conectar ao banco"
    echo "   Verifique:"
    echo "   - Se o banco está rodando"
    echo "   - Se DATABASE_URL está correto"
    echo ""
    echo "   Para PostgreSQL com Docker:"
    echo "   docker run --name horizon-ai-db \\"
    echo "     -e POSTGRES_USER=postgres \\"
    echo "     -e POSTGRES_PASSWORD=postgres \\"
    echo "     -e POSTGRES_DB=horizon_ai \\"
    echo "     -p 5432:5432 \\"
    echo "     -d postgres:15"
fi

# 6. Verificar Drizzle Kit
echo ""
echo -e "${YELLOW}[6]${NC} Verificando Drizzle Kit..."
if command -v drizzle-kit &> /dev/null; then
    echo -e "${GREEN}✓${NC} Drizzle Kit instalado globalmente"
elif [ -d "node_modules/.pnpm/drizzle-kit@*/node_modules/drizzle-kit" ]; then
    echo -e "${GREEN}✓${NC} Drizzle Kit instalado localmente"
else
    echo -e "${YELLOW}⚠${NC}  Drizzle Kit não encontrado"
    echo "   Execute: pnpm install"
fi

# 7. Verificar migrations
echo ""
echo -e "${YELLOW}[7]${NC} Verificando migrations..."
MIGRATIONS=$(find apps/api/src/database/migrations -name "*.sql" 2>/dev/null | wc -l)
echo -e "${GREEN}✓${NC} $MIGRATIONS migration(s) encontrada(s)"

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Próximos passos:                                              ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║  1. Aplicar migrations ao banco:                               ║${NC}"
echo -e "${BLUE}║     ${YELLOW}pnpm db:push${BLUE}                                                  ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║  2. Abrir Drizzle Studio (UI visual):                          ║${NC}"
echo -e "${BLUE}║     ${YELLOW}pnpm db:studio${BLUE}                                                ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║  3. Iniciar servidor de desenvolvimento:                       ║${NC}"
echo -e "${BLUE}║     ${YELLOW}pnpm -F @horizon-ai/api dev${BLUE}                                    ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
