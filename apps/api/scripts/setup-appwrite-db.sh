#!/bin/bash

# Appwrite Database Setup Script
# Este script cria o banco de dados e collections no Appwrite

set -e

echo "🚀 Configurando Appwrite Database para Horizon AI"
echo ""

# Verificar se as variáveis de ambiente estão configuradas
if [ -z "$APPWRITE_ENDPOINT" ] || [ -z "$APPWRITE_PROJECT_ID" ] || [ -z "$APPWRITE_API_KEY" ]; then
    echo "❌ Erro: Variáveis de ambiente do Appwrite não configuradas"
    echo ""
    echo "Configure as seguintes variáveis no arquivo .env:"
    echo "  APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1"
    echo "  APPWRITE_PROJECT_ID=your-project-id"
    echo "  APPWRITE_API_KEY=your-api-key"
    echo "  APPWRITE_DATABASE_ID=horizon_ai_db"
    echo ""
    exit 1
fi

DATABASE_ID="${APPWRITE_DATABASE_ID:-horizon_ai_db}"

echo "📝 Configuração:"
echo "   Endpoint: $APPWRITE_ENDPOINT"
echo "   Project ID: $APPWRITE_PROJECT_ID"
echo "   Database ID: $DATABASE_ID"
echo ""

# Função para criar collection
create_collection() {
    local collection_id=$1
    local collection_name=$2
    
    echo "📦 Criando collection: $collection_name ($collection_id)"
    
    # Aqui você pode usar a API do Appwrite ou o CLI
    # Por enquanto, vamos apenas mostrar instruções
    echo "   ℹ️  Use o Appwrite Console para criar a collection"
    echo "   📋 Collection ID: $collection_id"
    echo "   📋 Nome: $collection_name"
    echo ""
}

echo "⚠️  IMPORTANTE: Este é um script de instrução"
echo "Para criar as collections, você precisa:"
echo ""
echo "1️⃣  Acessar o Appwrite Console: https://cloud.appwrite.io"
echo "2️⃣  Ir para Databases > Create Database"
echo "3️⃣  Criar um banco com ID: $DATABASE_ID"
echo "4️⃣  Criar as seguintes collections:"
echo ""

create_collection "users" "Users"
create_collection "user_profiles" "User Profiles"
create_collection "user_preferences" "User Preferences"
create_collection "user_settings" "User Settings"

echo "📚 Para detalhes dos atributos de cada collection, consulte:"
echo "   apps/api/src/database/appwrite-schema.ts"
echo ""
echo "✅ Siga as instruções acima para completar a configuração!"
