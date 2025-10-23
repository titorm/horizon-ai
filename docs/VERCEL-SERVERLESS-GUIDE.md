# Guia de Deploy Serverless no Vercel

Este documento explica como a API foi configurada para funcionar de forma serverless no Vercel.

## 📋 Arquitetura

A aplicação foi configurada como um monorepo com:
- **Frontend** (`apps/web`): aplicação Vite/React estática
- **Backend** (`apps/api`): API NestJS serverless

### Estrutura de Arquivos

```
/
├── api/                          # Pasta de funções serverless do Vercel
│   └── index.js                  # Entry point que aponta para o handler NestJS
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── serverless.ts     # Handler serverless do NestJS
│   │   │   ├── main.ts           # Modo tradicional (dev local)
│   │   │   └── ...
│   │   ├── vercel.json           # Config específica da API
│   │   └── package.json
│   └── web/
│       ├── dist/                 # Build estático do frontend
│       └── package.json
└── vercel.json                   # Configuração principal do Vercel
```

## 🔧 Configuração

### 1. Handler Serverless (`apps/api/src/serverless.ts`)

O handler serverless foi criado para:
- Criar uma instância do NestJS com Express
- Cachear a aplicação entre invocações (warm starts)
- Configurar CORS para produção
- Expor um handler compatível com Vercel

### 2. Entry Point (`api/index.js`)

Convenção do Vercel: funções na pasta `/api` são automaticamente serverless.
Este arquivo importa e re-exporta o handler compilado do NestJS.

### 3. Configuração do Vercel (`vercel.json`)

```json
{
  "buildCommand": "pnpm install && pnpm --filter @horizon-ai/api build && pnpm --filter @horizon-ai/web build",
  "outputDirectory": "apps/web/dist",
  "installCommand": "pnpm install",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api"
    }
  ]
}
```

**O que faz:**
- Build tanto a API quanto o frontend
- Rotas `/api/*` são direcionadas para a função serverless
- Outras rotas servem o frontend estático

## 🚀 Deploy

### Deploy via CLI

```bash
# Instalar Vercel CLI
pnpm install -g vercel

# Deploy de preview
vercel

# Deploy de produção
vercel --prod
```

### Deploy via Git

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Push para a branch `main` ou `feat/vercel`

## 🔐 Variáveis de Ambiente

Configure no Vercel Dashboard ou via CLI:

```bash
vercel env add APPWRITE_ENDPOINT
vercel env add APPWRITE_PROJECT_ID
vercel env add APPWRITE_API_KEY
vercel env add JWT_SECRET
vercel env add CORS_ORIGIN
```

### Variáveis Necessárias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `APPWRITE_ENDPOINT` | URL do Appwrite | `https://cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT_ID` | ID do projeto Appwrite | `your-project-id` |
| `APPWRITE_API_KEY` | Chave API do Appwrite | `your-api-key` |
| `APPWRITE_DATABASE_ID` | ID do banco de dados | `horizon-ai-db` |
| `JWT_SECRET` | Secret para tokens JWT | `your-secret-key` |
| `JWT_EXPIRES_IN` | Expiração do JWT | `7d` |
| `CORS_ORIGIN` | Origens permitidas (separadas por vírgula) | `https://horizon-ai.vercel.app,https://*.vercel.app` |

## 🧪 Testes Locais

### Modo Serverless Local

```bash
# Instalar Vercel CLI
pnpm install -g vercel

# Rodar em modo dev (simula ambiente serverless)
vercel dev
```

### Modo Tradicional (para desenvolvimento)

```bash
# Terminal 1: API
cd apps/api
pnpm dev

# Terminal 2: Frontend
cd apps/web
pnpm dev
```

## 📊 Monitoramento

No Vercel Dashboard você pode monitorar:
- **Functions**: tempo de execução, invocações, erros
- **Logs**: logs em tempo real das funções
- **Analytics**: métricas de uso
- **Deployments**: histórico de deploys

## ⚡ Otimizações

### Cold Starts

O handler mantém a instância NestJS em cache:

```typescript
let cachedApp: Express | null = null;

async function createApp(): Promise<Express> {
  if (cachedApp) {
    return cachedApp;  // Reutiliza instância existente
  }
  // ... criação da app
  cachedApp = expressApp;
  return expressApp;
}
```

### Bundle Size

O `.vercelignore` exclui arquivos desnecessários:
- Testes (`*.test.ts`, `*.spec.ts`)
- Scripts de desenvolvimento
- Backups
- Documentação (opcional)

### Timeout

Funções serverless no Vercel têm limite de tempo:
- **Hobby**: 10s
- **Pro**: 60s
- **Enterprise**: 900s

Certifique-se que suas rotas respondem dentro desses limites.

## 🔍 Troubleshooting

### Erro: "Module not found"

Verifique se todas as dependências estão em `dependencies` (não `devDependencies`):

```json
{
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "express": "^4.18.2",
    // ... outras deps necessárias em runtime
  }
}
```

### Erro: "Function timeout"

Reduza o tempo de processamento ou:
1. Upgrade para plano Pro/Enterprise
2. Use background jobs para operações longas
3. Otimize queries do banco de dados

### CORS Errors

Certifique-se que `CORS_ORIGIN` inclui seu domínio:

```env
CORS_ORIGIN=https://horizon-ai.vercel.app,https://*.vercel.app
```

### Environment Variables não carregam

1. Verifique no Vercel Dashboard se as variáveis estão definidas
2. Faça redeploy após adicionar variáveis
3. Certifique-se que `env-loader.ts` está sendo executado primeiro

## 📚 Referências

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [NestJS on Vercel](https://docs.nestjs.com/faq/serverless)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
