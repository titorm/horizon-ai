# Transactions API - Quick Start Guide

## 🚀 Setup Rápido

### 1. Criar Collection no Appwrite

```bash
cd apps/api
./scripts/create-transactions-collection.sh
```

### 2. Verificar se está funcionando

A API já está configurada e pronta para uso. O módulo `TransactionsModule` foi adicionado ao `app.module.ts`.

## 📍 Endpoints Disponíveis

### Transações Manuais (Frontend)

```bash
# Criar transação manual
POST /transactions/manual
Authorization: Bearer <token>

# Listar transações do usuário
GET /transactions?userId=<userId>&limit=50

# Obter transação específica
GET /transactions/<id>

# Atualizar transação
PUT /transactions/<id>

# Deletar transação
DELETE /transactions/<id>
```

### Transações de Integração

```bash
# Criar transação de integração
POST /transactions/integration

# Criar múltiplas transações (bulk)
POST /transactions/integration/bulk
```

### Estatísticas

```bash
# Obter estatísticas do usuário
GET /transactions/stats/<userId>?startDate=2025-10-01&endDate=2025-10-31
```

## 🧪 Testar Endpoints

### 1. Criar uma transação manual

```bash
curl -X POST http://localhost:4000/transactions/manual \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "user_123",
    "amount": 150.50,
    "type": "expense",
    "category": "Alimentação",
    "description": "Almoço no restaurante",
    "date": "2025-10-22T12:30:00Z",
    "merchant": "Restaurante ABC",
    "currency": "BRL"
  }'
```

### 2. Listar transações

```bash
curl -X GET "http://localhost:4000/transactions?userId=user_123&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Obter estatísticas

```bash
curl -X GET "http://localhost:4000/transactions/stats/user_123?startDate=2025-10-01&endDate=2025-10-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Campos Principais

| Campo      | Tipo     | Descrição                             |
| ---------- | -------- | ------------------------------------- |
| `userId`   | string   | ID do usuário                         |
| `amount`   | number   | Valor da transação                    |
| `type`     | enum     | income, expense, transfer             |
| `category` | string   | Categoria da transação                |
| `date`     | datetime | Data da transação                     |
| `currency` | string   | Moeda (BRL, USD, etc)                 |
| `status`   | enum     | pending, completed, failed, cancelled |
| `source`   | enum     | manual, integration, import           |

## 🔐 Autenticação

Todos os endpoints requerem autenticação JWT:

```typescript
headers: {
  'Authorization': 'Bearer <JWT_TOKEN>',
  'Content-Type': 'application/json'
}
```

## 📚 Documentação Completa

Veja a documentação completa em: [docs/TRANSACTIONS-FEATURE.md](../../docs/TRANSACTIONS-FEATURE.md)

## 🛠️ Arquivos Criados

```
apps/api/src/
├── database/
│   ├── appwrite-schema.ts          (+ transactionsSchema)
│   ├── dto/index.ts                (+ Transaction DTOs)
│   └── services/
│       ├── appwrite-transaction.service.ts
│       └── appwrite-transaction.service.module.ts
├── transactions/
│   ├── transactions.controller.ts
│   └── transactions.module.ts
└── app.module.ts                   (+ TransactionsModule)

apps/api/scripts/
└── create-transactions-collection.sh

docs/
└── TRANSACTIONS-FEATURE.md
```

## ⚡ Próximos Passos

1. ✅ Collection criada no Appwrite
2. ✅ API endpoints disponíveis
3. 🔲 Implementar no frontend
4. 🔲 Configurar integrações bancárias
5. 🔲 Adicionar categorização automática
6. 🔲 Criar dashboard de analytics
