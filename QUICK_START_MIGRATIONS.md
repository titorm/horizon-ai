# 🎯 QUICK START - Migrations com Drizzle ORM

## O Problema foi Resolvido! ✅

**Antes:** Migrations não criavam tabelas no banco  
**Depois:** Migrations funcionam corretamente com `pnpm db:push`

---

## ⚡ 3 Passos para Começar

### 1. Verificar Setup (1 minuto)

```bash
./test-db-setup.sh
```

Isso vai:

- ✓ Verificar `.env.local`
- ✓ Validar `DATABASE_URL`
- ✓ Testar conexão com banco
- ✓ Listar migrations

### 2. Aplicar Migrations (1 segundo)

```bash
pnpm db:push
```

Pronto! Suas tabelas foram criadas no banco.

### 3. Visualizar Dados (opcional)

```bash
pnpm db:studio
```

Acesse: `http://localhost:3000`

---

## 📋 Todos os Comandos

```bash
pnpm db:generate   # Gerar migration baseada no schema.ts
pnpm db:push       # Aplicar migrations ao banco ⭐ PRINCIPAL
pnpm db:migrate    # Alternativa ao push
pnpm db:studio     # Abrir UI visual
pnpm db:drop       # ⚠️ Deletar todas as tabelas
```

---

## 🔧 Como Adicionar Nova Tabela

```bash
# 1. Editar schema.ts
vim apps/api/src/database/schema.ts

# 2. Gerar migration
pnpm db:generate

# 3. Aplicar ao banco
pnpm db:push

# 4. Usar no código
# import { db } from './database/db';
# const data = await db.select().from(myTable);
```

---

## 📁 Estrutura

```text
horizon-ai/
├── .env.local                         ← Seu DATABASE_URL
├── drizzle.config.ts                  ← Config Drizzle
├── apps/api/
│   ├── src/database/
│   │   ├── schema.ts                 ← Defina tabelas aqui
│   │   ├── db.ts                     ← Instância Drizzle
│   │   └── migrations/               ← SQL auto-gerado
│   └── scripts/
│       └── db-command.sh             ← Wrapper (não mexa!)
└── DRIZZLE_MIGRATION_GUIDE.md        ← Guia completo
```

---

## ⚠️ Common Issues

| Problema | Solução |
|----------|---------|
| "DATABASE_URL não configurada" | `cat .env.local \| grep DATABASE_URL` |
| "Erro ao conectar" | Verificar se PostgreSQL está rodando |
| "Migrations não são criadas" | Executar `pnpm db:push` |
| "Não vejo as tabelas" | Abrir `pnpm db:studio` para visualizar |

---

## 🚀 Próximo: Iniciar Server

```bash
pnpm -F @horizon-ai/api dev
```

Server rodando em: `http://localhost:8811`

---

## 📚 Mais Informações

- **Guia Completo:** `DRIZZLE_MIGRATION_GUIDE.md`
- **Setup Ambiente:** `ENV_SETUP.md`
- **API Docs:** `apps/api/README.md`

---

## Tudo funcionando! 🎉
