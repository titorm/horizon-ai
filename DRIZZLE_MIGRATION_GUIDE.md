# 🗄️ Guia de Uso - Drizzle ORM & Migrations

## ✅ O Que Foi Corrigido

### Problema Original

As migrations não estavam sendo aplicadas ao PostgreSQL definido em `DATABASE_URL`. O Drizzle Kit não estava carregando as variáveis de ambiente corretamente.

### Solução Implementada

1. **Script Wrapper (`db-command.sh`)**
   - Carrega `.env.local` ou `.env` da raiz do monorepo
   - Exporta variáveis de ambiente antes de executar Drizzle Kit
   - Garante que `DATABASE_URL` está disponível

2. **Config Aprimorada (`drizzle.config.ts`)**
   - Valida `DATABASE_URL` na inicialização
   - Log do arquivo de configuração sendo usado
   - Tratamento robusto de erro se DATABASE_URL não for encontrada

3. **Package.json Atualizado**
   - Todos os comandos `db:*` agora usam o wrapper `db-command.sh`
   - Explicitamente passa `--config ./drizzle.config.ts`

## 🚀 Como Usar

### 1. Setup Inicial

```bash
# Na raiz do monorepo
cp .env.example .env.local

# Editar .env.local com DATABASE_URL
# Para PostgreSQL local:
#   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/horizon_ai
# Para Supabase:
#   DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres
```

### 2. Verificar Setup

```bash
./test-db-setup.sh
```

### 3. Aplicar Migrations

```bash
# Aplicar todas as migrations ao banco
pnpm db:push

# Verificar status visualmente
pnpm db:studio
```

## 📋 Comandos Disponíveis

```bash
# Gerar nova migration
pnpm db:generate

# Aplicar migrations ao banco
pnpm db:push

# Executar migrations (alternativa ao push)
pnpm db:migrate

# Abrir Drizzle Studio (UI visual)
pnpm db:studio

# Deletar todas as tabelas (CUIDADO!)
pnpm db:drop

# Scripts antigos (ainda funcionam, mas recomenda-se usar os acima)
pnpm migrate:push
pnpm migrate:status
pnpm migrate:generate
```

## 🔄 Fluxo de Trabalho Típico

### Adicionar Nova Tabela

```bash
# 1. Editar schema.ts
nano apps/api/src/database/schema.ts

# 2. Gerar migration baseada nas mudanças
pnpm db:generate

# 3. Revisar arquivo SQL gerado (opcional)
cat apps/api/src/database/migrations/XXXX_*.sql

# 4. Aplicar ao banco de dados
pnpm db:push

# 5. Usar no código
# import { db } from './database/db';
# const users = await db.select().from(usersTable);
```

## 🔍 Verificação - Confirme que Está Funcionando

```bash
# 1. Iniciar server
pnpm -F @horizon-ai/api dev

# 2. Em outro terminal, abrir Studio
pnpm db:studio

# 3. Verificar se as tabelas aparecem:
#    - users (deve estar lá!)
#    - Qualquer outra tabela adicionada
```

## 📊 Como Funciona Internamente

```text
pnpm db:push
    ↓
[package.json] scripts.db:push = "bash scripts/db-command.sh push"
    ↓
[db-command.sh]
  1. Encontra .env.local na raiz do monorepo
  2. Export todas as variáveis (DATABASE_URL, NODE_ENV, etc)
  3. Muda para a raiz do monorepo
  4. Executa: drizzle-kit push --config ./drizzle.config.ts
    ↓
[drizzle.config.ts]
  1. Confirma que DATABASE_URL está definida
  2. Conecta ao banco usando PostgreSQL driver
  3. Lê schema de apps/api/src/database/schema.ts
  4. Aplica as SQL migrations
    ↓
✅ Tabelas criadas no seu PostgreSQL!
```

## ⚠️ Troubleshooting

### ❌ "DATABASE_URL não configurada"

```bash
# Verificar se existe .env.local NA RAIZ
cat .env.local | grep DATABASE_URL

# Se não existe, criar:
cp .env.example .env.local
```

### ❌ "Erro ao conectar ao banco"

```bash
# 1. Testar conexão manualmente
psql "$DATABASE_URL" -c "SELECT 1"

# 2. Para PostgreSQL com Docker:
docker run -d --name horizon-ai-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=horizon_ai \
  -p 5432:5432 \
  postgres:15

# 3. Depois atualizar .env.local:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/horizon_ai
```

### ❌ "Migration não aparece no banco"

```bash
# 1. Verificar se migration foi gerada
ls apps/api/src/database/migrations/

# 2. Abrir Studio para ver status visual
pnpm db:studio

# 3. Verificar logs:
pnpm db:push 2>&1 | tee drizzle-push.log
```

### ❌ "Banco fora de sincronismo com schema.ts"

```bash
# Opção 1: Deletar todas as tabelas e refazer
pnpm db:drop      # ⚠️ DELETA TUDO!
pnpm db:push

# Opção 2: Criar migration manual
# Editar apps/api/src/database/migrations/
```

## 📚 Recursos

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [ENV_SETUP.md](./ENV_SETUP.md) - Configuração de ambiente detalhada
- [apps/api/README.md](./apps/api/README.md) - Documentação da API

## 🎯 Resumo

✅ Migrations agora são aplicadas corretamente ao DATABASE_URL  
✅ Script wrapper garante ambiente correto  
✅ Drizzle Studio fornece UI visual  
✅ Suporta PostgreSQL local e Supabase  
✅ Comandos simples e intuitivos  
✅ Troubleshooting documentado  

**Agora é seguro usar `pnpm db:push` para gerenciar seu banco de dados!** 🎉
