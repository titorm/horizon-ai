# 🚀 Quick Start - Appwrite Setup

## 1️⃣ Configure Appwrite (5 minutos)

### Criar conta e projeto
1. Acesse: https://cloud.appwrite.io/console
2. Crie uma conta (ou faça login)
3. Crie um novo projeto chamado "Horizon AI"
4. **Copie o Project ID**

### Criar API Key
1. No projeto, vá em **Settings** → **API Keys**
2. Clique em **Create API Key**
3. Nome: `Horizon AI Backend`
4. Selecione os scopes:
   - `users.read`
   - `users.write`
   - `sessions.read`
   - `sessions.write`
5. **Copie a API Key** (você só verá uma vez!)

## 2️⃣ Configure o .env.local

Edite `.env.local` na **raiz do turborepo** (`/Users/titorm/Documents/horizon-ai/.env.local`):

```bash
# Appwrite - SUBSTITUA com suas credenciais
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=SEU_PROJECT_ID_AQUI
APPWRITE_API_KEY=SUA_API_KEY_AQUI

# JWT Secret (pode manter o existente ou gerar novo)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Resto pode manter igual
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001
COOKIE_HTTP_ONLY=true
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
COOKIE_MAX_AGE=604800000
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

## 3️⃣ Iniciar o projeto

```bash
cd /Users/titorm/Documents/horizon-ai
pnpm dev
```

Você deve ver:
```
✅ Loaded from .env.local
✅ Environment variables loaded successfully
✅ Appwrite client initialized successfully
🚀 Horizon AI API is running on http://localhost:3001
```

## 4️⃣ Testar

1. Acesse http://localhost:5173
2. Clique em "Sign Up"
3. Preencha o formulário
4. Verifique no Appwrite Console (Auth → Users)

## ✅ Checklist

- [ ] Conta criada no Appwrite
- [ ] Projeto criado
- [ ] API Key criada com scopes corretos
- [ ] `.env.local` atualizado com credenciais
- [ ] Servidor inicia sem erros
- [ ] Signup/Login funcionando

## 🐛 Problemas comuns

### "APPWRITE_ENDPOINT is not set"
→ Verifique se editou o `.env.local` na **raiz do turborepo**

### "Invalid API key"
→ Confirme que copiou a API key corretamente e tem os scopes necessários

### "Project not found"
→ Verifique o Project ID no console do Appwrite

## 📚 Mais informações

- `APPWRITE-SETUP.md` - Guia completo
- `MIGRATION-APPWRITE.md` - Detalhes técnicos da migração
- `.env.appwrite.example` - Exemplo de configuração

---

**Pronto em 5 minutos!** ⚡
