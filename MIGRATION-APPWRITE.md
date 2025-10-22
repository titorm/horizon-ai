# 🚀 Horizon AI - Guia de Migração para Appwrite

## ✅ O que foi removido

### Banco de Dados PostgreSQL/Supabase
- ❌ Removido `drizzle-orm` e `drizzle-kit`
- ❌ Removido `pg` (PostgreSQL driver)
- ❌ Removido `bcrypt` (Appwrite faz hash internamente)
- ❌ Removida pasta `apps/api/src/database/`
- ❌ Removida pasta `apps/api/src/entities/`
- ❌ Removido `DatabaseModule`
- ❌ Removidos scripts de migrations

## ✅ O que foi adicionado

### Appwrite Backend
- ✅ Instalado `node-appwrite` SDK
- ✅ Criado `apps/api/src/appwrite/appwrite.client.ts` - Cliente Appwrite
- ✅ Criado `apps/api/src/appwrite/appwrite.module.ts` - Módulo NestJS
- ✅ Reescrito `auth.service.ts` para usar Appwrite Auth
- ✅ Atualizado `env-loader.ts` para validar variáveis do Appwrite

### Estrutura do Appwrite

```typescript
// Cliente Appwrite
getAppwriteAccount()   // Gerenciamento de usuários e sessões
getAppwriteDatabases() // Banco de dados (para uso futuro)
generateId()           // Gera IDs únicos
```

## 🔧 Setup do Appwrite

### 1. Criar conta no Appwrite Cloud

Acesse: https://cloud.appwrite.io/console

### 2. Criar novo projeto

- Clique em "Create Project"
- Nome: "Horizon AI"
- Copie o **Project ID**

### 3. Configurar API Key

1. Vá em **Settings** > **API Keys**
2. Clique em "Create API Key"
3. Nome: "Horizon AI Backend"
4. Scopes necessários:
   - ✅ `users.read`
   - ✅ `users.write`
   - ✅ `sessions.read`
   - ✅ `sessions.write`
5. Copie a **API Key** (você só verá uma vez!)

### 4. Configurar variáveis de ambiente

Edite o `.env.local` na **raiz do turborepo**:

```bash
# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=seu_project_id_aqui
APPWRITE_API_KEY=sua_api_key_aqui

# JWT (mantenha o mesmo ou gere novo)
JWT_SECRET=your-super-secret-jwt-key

# Server (mantenha igual)
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001

# Cookies (mantenha igual)
COOKIE_HTTP_ONLY=true
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
COOKIE_MAX_AGE=604800000

# CORS (mantenha igual)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 5. (Opcional) Configurar Auth Provider

No Appwrite Console:
1. Vá em **Auth** > **Settings**
2. Configure limites de sessão
3. Configure políticas de senha (mínimo 8 caracteres)

## 🚀 Como usar

### Iniciar o projeto

```bash
# Na raiz do turborepo
pnpm dev
```

### Testar autenticação

1. Acesse `http://localhost:5173`
2. Clique em "Sign Up"
3. Preencha os dados
4. O usuário será criado no Appwrite automaticamente!

### Ver usuários no Appwrite

1. Vá para https://cloud.appwrite.io/console
2. Selecione seu projeto
3. Clique em **Auth** no menu lateral
4. Você verá todos os usuários cadastrados

## 📊 Diferenças de implementação

### Antes (PostgreSQL + Drizzle)

```typescript
// Hash manual de senha
const hashedPassword = await bcrypt.hash(password, 12);

// Insert manual no banco
const user = await db.insert(users).values({
  email,
  password: hashedPassword,
  firstName,
  lastName,
});
```

### Agora (Appwrite)

```typescript
// Appwrite faz tudo automaticamente
const account = getAppwriteAccount();
const user = await account.create(userId, email, password, name);

// Hash de senha, validação, unicidade - tudo gerenciado pelo Appwrite
```

## 🔐 Segurança

### Appwrite cuida de:
- ✅ Hash de senha (bcrypt automático)
- ✅ Validação de email único
- ✅ Gerenciamento de sessões
- ✅ Rate limiting
- ✅ Verificação de email (se configurado)
- ✅ 2FA (se configurado)

### Você ainda precisa:
- ✅ Manter JWT_SECRET seguro
- ✅ Usar HTTPS em produção
- ✅ Configurar COOKIE_SECURE=true em produção

## 🎯 Fluxo de Autenticação

### Sign Up
1. Frontend envia POST `/auth/sign-up`
2. Backend cria usuário no Appwrite
3. Appwrite retorna user ID e email
4. Backend gera JWT token
5. JWT armazenado em cookie HTTP-only
6. Frontend recebe dados do usuário

### Sign In
1. Frontend envia POST `/auth/sign-in`
2. Backend cria sessão no Appwrite
3. Appwrite valida credenciais
4. Backend gera JWT token
5. JWT armazenado em cookie HTTP-only
6. Frontend recebe dados do usuário

### Sign Out
1. Frontend envia POST `/auth/sign-out`
2. Backend limpa cookie
3. Sessão permanece no Appwrite (pode ser deletada se necessário)

## 📝 Próximos passos

### Funcionalidades adicionais do Appwrite

1. **Database** - Armazenar dados da aplicação
2. **Storage** - Upload de arquivos/fotos
3. **Functions** - Serverless functions
4. **Realtime** - WebSocket para updates em tempo real
5. **Teams** - Gerenciamento de times/organizações

### Migração de dados existentes

Se você tinha dados no PostgreSQL:
1. Exporte os usuários do banco antigo
2. Use o Appwrite API para importar
3. Ou deixe os usuários se cadastrarem novamente

## 🐛 Troubleshooting

### "APPWRITE_ENDPOINT is not set"
- Verifique o `.env.local` na raiz do turborepo
- Certifique-se de que tem todas as variáveis do Appwrite

### "Invalid API key"
- Verifique se copiou a API key corretamente
- Confirme que a key tem os scopes necessários
- Tente criar uma nova API key

### "Project not found"
- Verifique o Project ID no console do Appwrite
- Certifique-se de copiar o ID correto

### "User already exists"
- Email já está cadastrado
- Use outro email ou delete o usuário no Appwrite Console

## 📚 Documentação

- Appwrite Docs: https://appwrite.io/docs
- Appwrite Node SDK: https://appwrite.io/docs/sdks#server
- Appwrite Auth: https://appwrite.io/docs/products/auth

---

**Pronto!** Seu backend agora usa Appwrite em vez de PostgreSQL/Supabase! 🎉
