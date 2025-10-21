# Configuração Centralizada de Ambiente (.env)

## Visão Geral

O monorepo agora carrega todas as variáveis de ambiente a partir de um **único arquivo `.env` ou `.env.local` na raiz do projeto**, em vez de arquivos separados em cada aplicação.

## Estrutura

```tree
horizon-ai/
├── .env.local          ← Variáveis de ambiente (prioridade alta, não versionado)
├── .env                ← Variáveis de ambiente fallback (versionado)
├── .env.example        ← Template de variáveis
├── apps/
│   ├── api/
│   │   ├── src/
│   │   ├── scripts/
│   │   └── package.json
│   └── web/
└── packages/
    └── config/
```

## Como Usar

### 1. Configuração Inicial

```bash
# Copiar template para criar arquivo local
cp .env.example .env.local

# Editar com suas variáveis (não será versionado)
nano .env.local
```

### 2. Variáveis Suportadas

```env
# Server
NODE_ENV=development
PORT=8811
API_URL=http://localhost:8811

# Database - PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/horizon_ai

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRATION=30d

# Cookies
COOKIE_MAX_AGE=604800000
COOKIE_SECURE=false
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=lax

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Gemini AI
GEMINI_API_KEY=your_gemini_key
```

## Como Funciona

### NestJS (apps/api)

O `AppModule` carrega `.env` da raiz:

```typescript
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [
    path.resolve(__dirname, '../../../.env.local'),
    path.resolve(__dirname, '../../../.env'),
  ],
})
```

### Drizzle ORM (drizzle.config.ts)

Carrega `.env.local` primeiro:

```typescript
dotenv.config({ path: envPath });
// Tenta .env.local, depois .env
```

### Scripts de Migration

#### TypeScript (apps/api/scripts/migrate.ts)

```typescript
const monoRepoRoot = path.resolve(__dirname, '../..');
const envFile = path.join(monoRepoRoot, '.env.local') || path.join(monoRepoRoot, '.env');
```

#### Bash (apps/api/scripts/migrate-db.sh)

```bash
MONO_REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
ENV_FILE="${MONO_REPO_ROOT}/.env.local"
if [ ! -f "$ENV_FILE" ]; then
    ENV_FILE="${MONO_REPO_ROOT}/.env"
fi
```

### Turbo (turbo.json)

Configurado para monitorar `.env` na raiz:

```json
{
  "globalDependencies": [
    ".env",
    ".env.local",
    "tsconfig.json"
  ],
  "globalEnv": [
    "NODE_ENV",
    "DATABASE_URL",
    "JWT_SECRET",
    ...
  ]
}
```

## Ordem de Prioridade

As variáveis são carregadas nesta ordem (primeira encontrada vence):

1. **`.env.local`** - Arquivo local (não versionado) - MAIOR PRIORIDADE
2. **`.env`** - Arquivo versionado (fallback)
3. **Variáveis do sistema** - Se definidas antes de executar

## Arquivo .gitignore

```gitignore
.env.local          # Nunca versione
.env*.local         # Variáveis locais
*.env.local.bak     # Backups locais
```

## Exemplos de Uso

### Iniciar API com variáveis da raiz

```bash
# Usa .env.local ou .env da raiz
pnpm -F @horizon-ai/api dev
```

### Migrations do banco de dados

```bash
# Carrega .env da raiz automaticamente
cd apps/api
pnpm migrate:push

# Ou usando script Bash
./scripts/migrate-db.sh push
```

### Gerar nova migration

```bash
pnpm -F @horizon-ai/api migrate:generate
```

### Abrir Drizzle Studio

```bash
pnpm -F @horizon-ai/api migrate:studio
# Acessar em: https://local.drizzle.studio
```

## Troubleshooting

### ❌ "DATABASE_URL não está definida"

```bash
# Verificar se .env.local existe
ls -la .env.local

# Ou criar a partir do template
cp .env.example .env.local
nano .env.local
```

### ❌ "Variáveis não são carregadas no desenvolvimento"

```bash
# Limpar cache do Node e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Reiniciar o servidor
pnpm -F @horizon-ai/api dev
```

### ❌ "Erro ao conectar com PostgreSQL"

```bash
# Verificar DATABASE_URL em .env.local
cat .env.local | grep DATABASE_URL

# Testar conexão
psql "$DATABASE_URL" -c "SELECT 1"
```

### ❌ "Script de migration não encontra .env"

```bash
# Verificar se está no diretório correto
cd /Users/titorm/Documents/horizon-ai/apps/api

# Executar com path completo
./scripts/migrate-db.sh help
```

## Melhores Práticas

✅ **DO:**

- Usar `.env.local` para desenvolvimento
- Versioná-lo no git apenas se necessário (com valores fictícios)
- Manter `.env.example` sempre atualizado
- Documentar variáveis no `README.md` ou `ENV_SETUP.md`

❌ **DON'T:**

- Versionar `.env.local` com valores reais/sensíveis
- Hardcodear variáveis de ambiente nos scripts
- Criar `.env` em múltiplas pastas
- Usar diferentes variáveis em diferentes apps

## Variáveis Globais (Turbo)

Essas variáveis são automaticamente injetadas em todos os apps/packages:

```bash
NODE_ENV
PORT
API_URL
DATABASE_URL
JWT_SECRET
JWT_EXPIRATION
JWT_REFRESH_SECRET
JWT_REFRESH_EXPIRATION
COOKIE_MAX_AGE
COOKIE_SECURE
COOKIE_HTTP_ONLY
COOKIE_SAME_SITE
CORS_ORIGIN
GEMINI_API_KEY
```

Para adicionar uma nova variável global:

1. Adicionar a `.env.example`:

```bash
NOVA_VAR=valor_padrao
```

1. Adicionar a `turbo.json` → `globalEnv`:

```json
"globalEnv": ["NOVA_VAR"]
```

1. Usar em qualquer app:

```typescript
const valor = process.env.NOVA_VAR;
```

## Referências

- [NestJS ConfigModule](https://docs.nestjs.com/techniques/configuration)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview)
- [Turbo Global Dependencies](https://turbo.build/repo/docs/reference/configuration-schema#dependson)
- [Environment Variables Best Practices](https://12factor.net/config)
