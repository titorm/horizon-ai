# Horizon AI - API

Serviço de API backend para a plataforma Horizon AI, construído com NestJS e Appwrite.

## Características

- ✅ Autenticação com JWT (sem dependência de terceiros para auth)
- ✅ Gerenciamento de sessão com Cookies HTTP-only
- ✅ Validação de dados com class-validator
- ✅ Appwrite Database para persistência de dados
- ✅ Integração completa com Appwrite SDK
- ✅ CORS configurável
- ✅ Testes com Jest
- ✅ TypeScript strict mode

## Quick Start

### 1. Configurar Appwrite Database

Siga o guia completo em [`APPWRITE-DATABASE-SETUP.md`](./APPWRITE-DATABASE-SETUP.md) para:

- Criar projeto no Appwrite Cloud ou instalar self-hosted
- Criar as 4 collections necessárias (users, profiles, preferences, settings)
- Configurar índices e atributos
- Obter as credenciais de API

#### Resumo Rápido

```bash
# 1. Criar conta no Appwrite Cloud
# Acesse: https://cloud.appwrite.io/

# 2. Criar novo projeto
# Dashboard > Create Project > "Horizon AI"

# 3. Criar Database
# Databases > Create Database > "production"

# 4. Executar script de setup
chmod +x scripts/setup-appwrite-db.sh
./scripts/setup-appwrite-db.sh
```

Para instruções detalhadas, consulte:

- **Setup completo**: [`APPWRITE-DATABASE-SETUP.md`](./APPWRITE-DATABASE-SETUP.md)
- **Guia de migração**: [`APPWRITE-MIGRATION.md`](./APPWRITE-MIGRATION.md)
- **Quick start**: [`APPWRITE-QUICKSTART.md`](./APPWRITE-QUICKSTART.md)

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar template
cp .env.example .env.local

# Editar .env.local (na raiz do monorepo!)
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=seu-project-id-aqui
APPWRITE_API_KEY=sua-api-key-aqui
APPWRITE_DATABASE_ID=production
```

### 3. Instalar Dependências

```bash
cd apps/api
pnpm install
```

### 4. Instalar dependências e rodar

```bash
# Install dependencies (na raiz do monorepo)
pnpm install

# Start development server with hot reload
pnpm -F @horizon-ai/api dev
```

## Desenvolvimento

### 4. Desenvolvimento da API

```bash
# Iniciar servidor de desenvolvimento (porta 8811)
pnpm -F @horizon-ai/api dev

# Executar testes
pnpm -F @horizon-ai/api test

# Executar testes com cobertura
pnpm -F @horizon-ai/api test:cov

# Lint
pnpm -F @horizon-ai/api lint

# Format
pnpm -F @horizon-ai/api format

# Type check
pnpm -F @horizon-ai/api typecheck
```

## Estrutura do Banco de Dados Appwrite

### Collections Criadas

1. **users** - Dados básicos do usuário
   - email, name, created_at, updated_at

2. **user_profiles** - Perfil completo do usuário
   - bio, avatar_url, phone, address, birth_date, etc.

3. **user_preferences** - Preferências do usuário
   - theme, language, notifications, timezone, etc.

4. **user_settings** - Configurações da conta
   - privacy, security, integrations, etc.

Para detalhes completos da estrutura:

- Schema TypeScript: [`src/database/appwrite-schema.ts`](./src/database/appwrite-schema.ts)
- Documentação: [`APPWRITE-DATABASE-SETUP.md`](./APPWRITE-DATABASE-SETUP.md)

### Estrutura de Arquivos

```text
apps/api/
├── src/database/
│   ├── appwrite-schema.ts              # Definição de collections
│   └── services/
│       ├── appwrite-user.service.ts    # Service CRUD de usuários
│       └── appwrite-user.service.module.ts  # Módulo NestJS
├── src/users/
│   ├── user.controller.ts              # REST API endpoints
│   └── user.module.ts                  # Módulo do controller
├── scripts/
│   └── setup-appwrite-db.sh            # Script de setup automático
├── APPWRITE-DATABASE-SETUP.md          # Guia completo de setup
├── APPWRITE-MIGRATION.md               # Guia de migração
└── APPWRITE-QUICKSTART.md              # Quick start
```

1. **Gerar migration**

## Uso do Service Appwrite

### Exemplos de Operações CRUD

```typescript
import { AppwriteUserService } from './database/services/appwrite-user.service';

// Criar usuário
const user = await appwriteUserService.createUser({
  email: 'user@example.com',
  name: 'John Doe',
});

// Criar perfil completo
const profile = await appwriteUserService.createProfile(userId, {
  bio: 'Developer',
  phone: '+55 11 98765-4321',
  address: {
    street: 'Rua Example',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    zipCode: '01234-567',
  },
});

// Atualizar preferências
const preferences = await appwriteUserService.updatePreferences(userId, {
  theme: 'dark',
  language: 'pt-BR',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
});

// Buscar usuário completo
const fullUser = await appwriteUserService.findUserById(userId);
```

### Troubleshooting

#### ❌ "APPWRITE_PROJECT_ID não configurada"

```bash
# Verificar se .env.local existe na RAIZ do monorepo
cat ../../.env.local | grep APPWRITE
```

#### ❌ "Erro ao conectar ao Appwrite"

Verifique:

1. Se o `APPWRITE_ENDPOINT` está correto
2. Se o `APPWRITE_PROJECT_ID` está correto
3. Se a `APPWRITE_API_KEY` tem permissões corretas
4. Se o database e as collections foram criadas

#### ❌ "Collection não encontrada"

Execute o script de setup:

```bash
chmod +x scripts/setup-appwrite-db.sh
./scripts/setup-appwrite-db.sh
```

## Build e Produção

```bash
# Build the project
pnpm build

# Start production server
pnpm start:prod
```

## API Endpoints

### User Profile

#### Get Profile

```bash
GET /users/:userId/profile

Response: 200
{
  "id": "document-id",
  "userId": "user-id",
  "bio": "Developer",
  "avatarUrl": "https://...",
  "phone": "+55 11 98765-4321",
  "address": { ... },
  "birthDate": "1990-01-01"
}
```

#### Update Profile

```bash
PATCH /users/:userId/profile
Content-Type: application/json

{
  "bio": "Senior Developer",
  "phone": "+55 11 91234-5678"
}

Response: 200
{
  "id": "document-id",
  "userId": "user-id",
  "bio": "Senior Developer",
  ...
}
```

### User Preferences

#### Get Preferences

```bash
GET /users/:userId/preferences

Response: 200
{
  "id": "document-id",
  "userId": "user-id",
  "theme": "dark",
  "language": "pt-BR",
  "notifications": { ... }
}
```

#### Update Preferences

```bash
PATCH /users/:userId/preferences
Content-Type: application/json

{
  "theme": "light",
  "language": "en-US"
}

Response: 200
{ ... }
```

### User Settings

#### Get Settings

```bash
GET /users/:userId/settings

Response: 200
{
  "id": "document-id",
  "userId": "user-id",
  "privacy": { ... },
  "security": { ... }
}
```

#### Update Settings

```bash
PATCH /users/:userId/settings
Content-Type: application/json

{
  "privacy": {
    "profileVisibility": "private"
  }
}

Response: 200
{ ... }
```

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

```text
src/
├── auth/                 # Autenticação
│   ├── dto/             # Data Transfer Objects
│   ├── guards/          # Guards de autenticação
│   ├── strategies/      # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── database/            # Database e schemas
│   ├── appwrite-schema.ts
│   └── services/
│       ├── appwrite-user.service.ts
│       └── appwrite-user.service.module.ts
├── users/               # User endpoints
│   ├── user.controller.ts
│   └── user.module.ts
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

**Appwrite:**

- `APPWRITE_ENDPOINT` - URL do Appwrite (ex: <https://cloud.appwrite.io/v1>)
- `APPWRITE_PROJECT_ID` - ID do projeto no Appwrite
- `APPWRITE_API_KEY` - API Key com permissões necessárias
- `APPWRITE_DATABASE_ID` - ID do database (ex: production)

**API:**

- `PORT` - Porta do servidor (padrão: 8811)
- `JWT_SECRET` - Chave secreta para JWT
- `JWT_EXPIRATION` - Expiração do JWT (padrão: 7d)

**Cookies:**

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
- ✅ Appwrite Database com permissões granulares

## Licença

MIT
