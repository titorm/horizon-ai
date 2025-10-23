<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1DalGvFlX6gsEPpFkwWxbhoGWQnt6skQ3

## Run Locally

**Prerequisites:**  Node.js, pnpm

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` with suas credenciais:
   - `DATABASE_URL`: PostgreSQL connection string (veja [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md))
   - `JWT_SECRET` e `JWT_REFRESH_SECRET`: Gerar com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `GEMINI_API_KEY`: Obter em [ai.google.dev](https://ai.google.dev/)

3. Setup do banco de dados:

   ```bash
   cd apps/api
   pnpm db:migrate
   ```

4. Executar em desenvolvimento:

   ```bash
   # Terminal 1: Backend (API)
   cd apps/api
   pnpm dev
   
   # Terminal 2: Frontend (Web)
   cd apps/web
   pnpm dev
   ```

### API Configuration

A aplicação usa variáveis de ambiente centralizadas para configurar a URL da API:

- **Backend**: `API_URL` em `.env.local` (padrão: `http://localhost:8811`)
- **Frontend**: `VITE_API_URL` em `apps/web/.env.local` (padrão: `http://localhost:8811`)

Todas as requisições HTTP do frontend para a API devem usar o helper `apiFetch` em `src/config/api.ts`:

```typescript
import { apiFetch, apiEndpoints } from "./config/api";

// Exemplo: Login
const res = await apiFetch(apiEndpoints.auth.signIn, {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
```

### Security

⚠️ **NUNCA** faça commit de `.env.local` com credenciais reais. O arquivo já está no `.gitignore`.

## 🚀 Deploy para Produção (Vercel)

A aplicação está configurada para deploy serverless no Vercel.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftitorm%2Fhorizon-ai)

### Manual Deploy

1. **Instalar Vercel CLI**:
   ```bash
   pnpm install -g vercel
   ```

2. **Configurar variáveis de ambiente no Vercel**:
   ```bash
   vercel env add APPWRITE_ENDPOINT
   vercel env add APPWRITE_PROJECT_ID
   vercel env add APPWRITE_API_KEY
   vercel env add JWT_SECRET
   # ... outras variáveis
   ```

3. **Deploy de preview**:
   ```bash
   vercel
   ```

4. **Deploy de produção**:
   ```bash
   vercel --prod
   ```

### Deploy Automático via Git

Push para a branch principal (`main` ou `feat/vercel`) para deploy automático:

```bash
git push origin main
```

### Documentação de Deploy

- 📖 [Guia Completo de Deploy Serverless](docs/VERCEL-SERVERLESS-GUIDE.md)
- ✅ [Checklist de Deploy](docs/DEPLOY-CHECKLIST.md)
- 📊 [Resumo da Configuração](docs/SERVERLESS-SUMMARY.md)

## 📁 Estrutura do Projeto

```
horizon-ai/
├── api/                        # Serverless function entry point
│   └── index.js               # Handler para Vercel
├── apps/
│   ├── api/                   # Backend NestJS
│   │   ├── src/
│   │   │   ├── serverless.ts  # Handler serverless
│   │   │   └── main.ts        # Entry point tradicional (dev)
│   │   └── vercel.json        # Config da API
│   └── web/                   # Frontend React
│       └── dist/              # Build estático
├── docs/                      # Documentação
├── packages/                  # Shared packages
└── vercel.json               # Config principal Vercel
```
