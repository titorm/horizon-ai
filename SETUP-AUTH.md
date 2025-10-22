# 🔐 Setup de Autenticação - Horizon AI

## ✅ O que foi ajustado

### Backend (API)

1. **Conexão com Banco de Dados** (`apps/api/src/database/db.ts`)
   - ✅ Pool de conexões PostgreSQL configurado com limites apropriados
   - ✅ Validação de `DATABASE_URL` ao iniciar
   - ✅ Tratamento de erros de conexão
   - ✅ Teste de conexão automático na inicialização
   - ✅ Graceful shutdown para fechar conexões corretamente

2. **Autenticação Segura** (`apps/api/src/auth/`)
   - ✅ Hash de senha com bcrypt e 12 salt rounds (mais seguro)
   - ✅ Validação de senha forte (mínimo 8 chars, maiúscula, minúscula, número)
   - ✅ JWT com expiração de 7 dias
   - ✅ Cookies HTTP-only para armazenar tokens
   - ✅ Logging adequado para auditoria
   - ✅ Tratamento de erros robusto

3. **Endpoints de Auth**
   - `POST /auth/sign-up` - Criar nova conta
   - `POST /auth/sign-in` - Login
   - `POST /auth/sign-out` - Logout (limpa cookies)
   - `GET /auth/me` - Obter usuário atual (protegido)

### Frontend (Web)

1. **Fluxo de Registro** (`apps/web/src/screens/RegisterScreen.tsx`)
   - ✅ Validação de senha em tempo real
   - ✅ Feedback visual de requisitos de senha
   - ✅ Campos para firstName e lastName
   - ✅ Integração completa com API

2. **Fluxo de Login** (`apps/web/src/screens/LoginScreen.tsx`)
   - ✅ Já estava funcional
   - ✅ Integrado com a API

3. **API Config** (`apps/web/src/config/api.ts`)
   - ✅ Endpoints corretos (`sign-out` em vez de `logout`)
   - ✅ Credenciais incluídas para cookies

4. **App Principal** (`apps/web/src/App.tsx`)
   - ✅ Fluxo completo de registro conectado à API
   - ✅ Mapeamento correto de dados backend → frontend
   - ✅ Logout chamando endpoint correto
   - ✅ Toast de feedback para todas as ações

## 🚀 Como usar

### 1. Configurar variáveis de ambiente

**Não mexa no `.env.local`** (você pediu para não mexer), mas certifique-se de que ele contém:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/horizon_ai"
JWT_SECRET="seu-secret-super-seguro-aqui"
PORT=3001
CORS_ORIGIN="http://localhost:5173"
```

### 2. Rodar migrations (se necessário)

```bash
cd /Users/titorm/Documents/horizon-ai
pnpm db:migrate
```

### 3. Iniciar o projeto

```bash
# Terminal 1 - API
cd apps/api
pnpm dev

# Terminal 2 - Web
cd apps/web
pnpm dev
```

### 4. Testar o fluxo

1. Acesse `http://localhost:5173`
2. Clique em "Get Started" ou "Sign Up"
3. Preencha os dados:
   - **First Name**: João
   - **Last Name**: Silva (opcional)
   - **Email**: joao@example.com
   - **Password**: Teste123 (pelo menos 8 chars, 1 maiúscula, 1 minúscula, 1 número)
4. Clique em "Create Account"
5. Você será levado para a tela de boas-vindas
6. Tente fazer login/logout

## 🔒 Segurança Implementada

### Senha
- ✅ Mínimo 8 caracteres
- ✅ Pelo menos 1 letra maiúscula
- ✅ Pelo menos 1 letra minúscula
- ✅ Pelo menos 1 número
- ✅ Hash com bcrypt (12 salt rounds)

### Autenticação
- ✅ JWT armazenado em cookie HTTP-only (não acessível via JavaScript)
- ✅ CORS configurado corretamente
- ✅ Validação de token em rotas protegidas
- ✅ Expiração de 7 dias

### Banco de Dados
- ✅ Pool de conexões configurado
- ✅ Timeout de conexão
- ✅ Graceful shutdown
- ✅ Email único (constraint no banco)

## 📝 Endpoints da API

### Sign Up
```bash
POST http://localhost:3001/auth/sign-up
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "Teste123",
  "firstName": "João",
  "lastName": "Silva"
}
```

### Sign In
```bash
POST http://localhost:3001/auth/sign-in
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "Teste123"
}
```

### Sign Out
```bash
POST http://localhost:3001/auth/sign-out
```

### Me (Requer autenticação)
```bash
GET http://localhost:3001/auth/me
Cookie: access_token=<seu-token>
```

## 🐛 Troubleshooting

### "Database connection failed"
- Verifique se o PostgreSQL está rodando
- Confirme a `DATABASE_URL` no `.env.local`
- Teste a conexão: `psql $DATABASE_URL`

### "Email already in use"
- O email já está cadastrado
- Use outro email ou delete o usuário do banco

### "Invalid email or password"
- Verifique email e senha
- Lembre-se: senha é case-sensitive

### "Password must contain..."
- A senha não atende aos requisitos
- Use pelo menos: 8 chars, 1 maiúscula, 1 minúscula, 1 número

## 📊 Estrutura do Usuário

### Backend (Database)
```typescript
{
  id: uuid,
  email: string,
  password: string (hash),
  firstName: string | null,
  lastName: string | null,
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Frontend (App State)
```typescript
{
  id: string,
  name: string,
  email: string,
  role: "FREE" | "PREMIUM"
}
```

## ✨ Próximos passos sugeridos

1. [ ] Implementar recuperação de senha
2. [ ] Adicionar 2FA (autenticação de dois fatores)
3. [ ] Rate limiting para evitar brute force
4. [ ] Refresh tokens para melhor segurança
5. [ ] Email de verificação após registro
6. [ ] Histórico de logins

---

**Nota**: O arquivo `.env.local` não foi modificado conforme solicitado! 🎯
