# 🎯 Início Rápido - Appwrite Database

## ⚡ Em 5 Minutos

### 1. Criar conta no Appwrite (2 min)

Acesse: <https://cloud.appwrite.io>

- Crie uma conta gratuita
- Crie um projeto "Horizon AI"
- Copie o **Project ID**

### 2. Gerar API Key (1 min)

No console:

- Settings > API Keys > Add API Key
- Nome: "Horizon AI Server"
- Scopes: Selecione **ALL**
- Copie a **API Key**

### 3. Configurar .env (1 min)

Na raiz do projeto, edite `.env` ou `.env.local`:

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=cole-seu-project-id-aqui
APPWRITE_API_KEY=cole-sua-api-key-aqui
APPWRITE_DATABASE_ID=horizon_ai_db
```

### 4. Criar Database e Collections (1 min)

No Appwrite Console:

**Database:**

- Databases > Add Database
- ID: `horizon_ai_db`
- Nome: "Horizon AI Database"

**Collections** (crie 4):

1. `users`
2. `user_profiles`
3. `user_preferences`
4. `user_settings`

📖 **Para detalhes dos atributos**: `APPWRITE-DATABASE-SETUP.md`

### 5. Iniciar API

```bash
cd apps/api
pnpm dev
```

## ✅ Pronto!

Teste:

```bash
curl http://localhost:3000/health
```

---

## 📚 Documentação Completa

- **Setup Detalhado**: `APPWRITE-DATABASE-SETUP.md`
- **Migração**: `APPWRITE-MIGRATION.md`
- **Schema**: `src/database/appwrite-schema.ts`

---

## 🆘 Problemas?

**Erro 404 Collection?**

→ Crie as collections no console Appwrite

**Erro de Permissão?**

→ Configure permissões: `read("any")` e `write("users")`

**API não inicia?**

→ Verifique se o `.env` tem todas as variáveis

---

**Boa sorte! 🚀**
