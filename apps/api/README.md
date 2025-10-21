# Horizon AI - API

Serviço de API backend para a plataforma Horizon AI, construído com NestJS e Drizzle ORM.

## Características

- ✅ Autenticação com JWT (sem dependência de terceiros para auth)
- ✅ Gerenciamento de sessão com Cookies HTTP-only
- ✅ Validação de dados com class-validator
- ✅ Drizzle ORM com PostgreSQL para persistência type-safe
- ✅ Migrations automáticas com Drizzle Kit
- ✅ CORS configurável
- ✅ Testes com Jest
- ✅ TypeScript strict mode

## Quick Start

### 1. Configurar Banco de Dados

Você pode usar **PostgreSQL local** ou **Supabase** (PostgreSQL em nuvem).

#### Opção A: PostgreSQL Local com Docker

```bash
# Iniciar PostgreSQL em container
docker run --name horizon-ai-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=horizon_ai \
  -p 5432:5432 \
  -d postgres:15

# Verificar se está rodando
docker ps | grep horizon-ai-db
```

#### Opção B: PostgreSQL Local (sem Docker)

```bash
# macOS com Homebrew
brew install postgresql@15
brew services start postgresql@15

# Criar banco de dados
createdb horizon_ai

# Conectar
psql horizon_ai
```

#### Opção C: Supabase (PostgreSQL em nuvem)

1. Criar conta em [supabase.com](https://supabase.com)
2. Criar novo projeto
3. Copiar `DATABASE_URL` da configuração

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar template
cp .env.example .env.local

# Editar .env.local (na raiz do monorepo!)
# Exemplo para PostgreSQL local:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/horizon_ai

# Ou para Supabase:
# DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres
```

### 3. Executar Migrations

```bash
# Aplicar todas as migrations ao banco
pnpm db:push

# Ou abrir UI visual do Drizzle
pnpm db:studio
```

### 4. Instalar dependências e rodar

```bash
# Install dependencies (na raiz do monorepo)
pnpm install

# Start development server with hot reload
pnpm -F @horizon-ai/api dev
```

## Desenvolvimento

### Comandos do Banco de Dados

```bash
# Gerar nova migration baseada em mudanças do schema.ts
pnpm db:generate

# Aplicar migrations ao banco de dados
pnpm db:push

# Executar migrations (alternativa)
pnpm db:migrate

# Abrir Drizzle Studio (UI visual para explorar dados)
pnpm db:studio

# Deletar todas as tabelas (CUIDADO!)
pnpm db:drop
```

### Desenvolvimento da API

```bash
# Start dev server (port 8811)
pnpm -F @horizon-ai/api dev

# Run tests
pnpm -F @horizon-ai/api test

# Run tests with coverage
pnpm -F @horizon-ai/api test:cov

# Lint
pnpm -F @horizon-ai/api lint

# Format
pnpm -F @horizon-ai/api format

# Type check
pnpm -F @horizon-ai/api typecheck
```

## Drizzle ORM & Migrations

### Estrutura

```text
apps/api/
├── src/database/
│   ├── schema.ts           # Definição de tabelas
│   ├── db.ts               # Instância Drizzle
│   ├── database.module.ts  # Módulo NestJS
│   └── migrations/         # SQL gerado automaticamente
└── scripts/
    └── db-command.sh       # Wrapper para db commands
```

### Fluxo de Trabalho: Adicionar Nova Tabela

1. **Editar schema.ts**

```typescript
// apps/api/src/database/schema.ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

1. **Gerar migration**

```bash
pnpm db:generate
# Gera arquivo SQL em apps/api/src/database/migrations/
```

1. **Revisar arquivo SQL gerado**

```bash
# O arquivo será criado em apps/api/src/database/migrations/
cat apps/api/src/database/migrations/0001_*.sql
```

1. **Aplicar migration ao banco**

```bash
pnpm db:push
```

1. **Usar em seus serviços**

```typescript
import { db } from './database/db';
import { posts } from './database/schema';

// Query
const allPosts = await db.select().from(posts);

// Insert
await db.insert(posts).values({
  title: 'Hello World',
  content: 'My first post',
});

// Update
await db.update(posts).set({ title: 'Updated' }).where(eq(posts.id, id));

// Delete
await db.delete(posts).where(eq(posts.id, id));
```

### Troubleshooting

#### ❌ "DATABASE_URL não configurada"

```bash
# Verificar se .env.local existe na RAIZ do monorepo
cat ../../.env.local | grep DATABASE_URL
```

#### ❌ "Erro ao conectar ao banco"

```bash
# Testar conexão
psql "$DATABASE_URL" -c "SELECT 1"

# Ou com Docker
docker ps | grep horizon-ai-db
```

#### ❌ "Migration não foi aplicada"

```bash
# Abrir Studio e verificar status
pnpm db:studio
# Acesse http://localhost:3000
```

## Build e Produção

```bash
# Build the project
pnpm build

# Start production server
pnpm start:prod
```

## API Endpoints

### Autenticação

#### Sign Up

```bash
POST /auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Sign In

```bash
POST /auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response: 200
{
  "message": "Signed in successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Get Current User

```bash
GET /auth/me
Authorization: Bearer <token>

Response: 200
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-10-20T00:00:00Z",
  "updatedAt": "2024-10-20T00:00:00Z"
}
```

#### Sign Out

```bash
POST /auth/sign-out

Response: 200
{
  "message": "Signed out successfully"
}
```

### Health Check

```bash
GET /health

Response: 200
{
  "status": "ok"
}
```

## Estrutura do Projeto

```mermaid
src/
├── auth/                 # Autenticação
│   ├── dto/             # Data Transfer Objects
│   ├── guards/          # Guards de autenticação
│   ├── strategies/      # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── entities/            # Entidades de banco de dados
│   └── user.entity.ts
├── health/              # Health check
│   ├── health.controller.ts
│   └── health.module.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## Variáveis de Ambiente

Veja `.env.example` para todas as variáveis disponíveis.

- `PORT` - Porta do servidor (padrão: 3001)
- `JWT_SECRET` - Chave secreta para JWT
- `JWT_EXPIRATION` - Expiração do JWT (padrão: 7d)
- `COOKIE_MAX_AGE` - Tempo máximo do cookie em ms
- `COOKIE_SECURE` - Usar cookies seguros (HTTPS)
- `COOKIE_HTTP_ONLY` - Apenas HTTP (não acessível via JavaScript)
- `COOKIE_SAME_SITE` - Política SameSite para cookies

## Segurança

- ✅ Senhas com hash usando bcrypt
- ✅ Autenticação JWT com expiração
- ✅ Cookies HTTP-only e secure
- ✅ CORS configurável
- ✅ Validação de entrada com class-validator

## Licença

MIT
