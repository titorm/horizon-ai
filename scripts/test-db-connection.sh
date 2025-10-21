#!/bin/bash
# Database connection test script

set -e

echo "🔍 Testando conexão com o banco de dados..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Erro: DATABASE_URL não configurada em .env.local"
  echo ""
  echo "Configure a variável DATABASE_URL com:"
  echo "  - PostgreSQL Local: postgresql://postgres:password@localhost:5432/horizon_ai"
  echo "  - Supabase: postgresql://postgres:PASSWORD@HOST:5432/postgres"
  echo ""
  echo "Veja docs/DATABASE_SETUP.md para mais informações"
  exit 1
fi

# Test connection using psql
DB_URL=$DATABASE_URL

# Extract connection string parts
if [[ $DB_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
  USER="${BASH_REMATCH[1]}"
  PASS="${BASH_REMATCH[2]}"
  HOST="${BASH_REMATCH[3]}"
  PORT="${BASH_REMATCH[4]}"
  DBNAME="${BASH_REMATCH[5]}"
  
  echo "📋 Conexão detectada:"
  echo "   User: $USER"
  echo "   Host: $HOST:$PORT"
  echo "   Database: $DBNAME"
  echo ""
  
  # Try to connect
  if PGPASSWORD="$PASS" psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DBNAME" -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ Conexão com sucesso!"
  else
    echo "❌ Falha ao conectar. Verifique:"
    echo "   - Credenciais no .env.local"
    echo "   - Se o banco de dados está rodando"
    echo "   - Firewall/Network rules"
    exit 1
  fi
else
  echo "❌ DATABASE_URL inválida. Formato esperado:"
  echo "   postgresql://user:password@host:port/database"
  exit 1
fi
