# Deploy no Vercel - Horizon AI

Este guia mostra como fazer o deploy do frontend Horizon AI no Vercel.

## 🚀 Deploy Automático (Recomendado)

### Via Vercel Dashboard

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe o repositório do GitHub
4. O Vercel detectará automaticamente as configurações do `vercel.json`
5. Clique em "Deploy"

### Via Vercel CLI

```bash
# Instale a CLI do Vercel
npm i -g vercel

# Faça login
vercel login

# Deploy do projeto
vercel

# Para produção
vercel --prod
```

## ⚙️ Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Dashboard do Vercel:

### Frontend (apps/web)

```env
# API Configuration
VITE_API_URL=https://your-api-url.com

# Appwrite Configuration (se usar)
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_COLLECTION_ACCOUNTS=your-accounts-collection-id
VITE_APPWRITE_COLLECTION_TRANSACTIONS=your-transactions-collection-id
VITE_APPWRITE_COLLECTION_CREDIT_CARDS=your-credit-cards-collection-id

# Optional
VITE_GOOGLE_AI_API_KEY=your-google-ai-key
```

## 📝 Configuração Atual

O projeto está configurado para fazer deploy apenas do **frontend** (apps/web):

- **Build Command**: `cd apps/web && pnpm build`
- **Output Directory**: `apps/web/dist`
- **Install Command**: `pnpm install`
- **Framework**: Vite
- **Node Version**: 22 (definido em `.nvmrc`)

## 🔧 Backend (API)

O backend (apps/api) **não** está incluído neste deploy do Vercel.

Opções para hospedar a API:

1. **Railway** - Deploy simples de Node.js
2. **Render** - Free tier disponível
3. **Fly.io** - Deploy global
4. **Heroku** - Tradicional e confiável
5. **AWS/Google Cloud** - Produção escalável

### Deploy da API separadamente

Se quiser fazer deploy da API também, você pode:

1. Criar um novo projeto Vercel apenas para a API
2. Usar Vercel Serverless Functions (requer adaptação)
3. Hospedar em outro serviço (recomendado)

## 🎯 Estrutura de Arquivos

```
horizon-ai/
├── vercel.json          # Configuração do Vercel
├── .vercelignore       # Arquivos ignorados no deploy
├── .nvmrc              # Versão do Node.js
├── package.json        # Root package com workspaces
├── turbo.json          # Configuração do Turborepo
└── apps/
    └── web/            # Frontend (deployed to Vercel)
        ├── dist/       # Build output
        ├── src/
        └── package.json
```

## ✅ Checklist Pré-Deploy

- [ ] Todas as variáveis de ambiente configuradas
- [ ] API backend rodando e acessível
- [ ] URLs da API atualizadas no código
- [ ] Build local funcionando: `cd apps/web && pnpm build`
- [ ] Preview local funcionando: `cd apps/web && pnpm preview`

## 🐛 Troubleshooting

### Erro: "Build failed"

```bash
# Teste o build localmente
cd apps/web
pnpm install
pnpm build
```

### Erro: "Module not found"

- Verifique se todas as dependências estão listadas em `apps/web/package.json`
- Execute `pnpm install` no root do projeto

### Erro: "API calls failing"

- Verifique a variável `VITE_API_URL`
- Certifique-se de que a API está acessível publicamente
- Verifique CORS na API

## 📚 Documentação Adicional

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Turborepo with Vercel](https://turbo.build/repo/docs/handbook/deploying-with-docker)

## 🔄 Continuous Deployment

Após o primeiro deploy, cada push para a branch principal (`main`) fará deploy automaticamente:

- **Production**: `main` branch
- **Preview**: Pull requests e outras branches

## 💡 Dicas

1. **Preview Deploys**: Cada PR gera um preview deploy único
2. **Environment Variables**: Configure diferentes valores para preview/production
3. **Domain**: Configure um domínio customizado no Dashboard
4. **Analytics**: Ative Vercel Analytics para métricas
5. **Speed Insights**: Monitore performance com Speed Insights

---

**Pronto!** Seu frontend estará rodando no Vercel em minutos. 🚀
