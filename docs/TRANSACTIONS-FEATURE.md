# Transactions Feature Documentation

## Visão Geral

A funcionalidade de **Transactions** permite aos usuários:
- **Adicionar transações manualmente** através de endpoints da API chamados pelo frontend
- **Importar transações automaticamente** via integrações com bancos e serviços financeiros
- Visualizar, filtrar e analisar suas transações
- Obter estatísticas financeiras

## Arquitetura

### Componentes

1. **Database Schema** (`apps/api/src/database/appwrite-schema.ts`)
   - Define a collection `transactions` no Appwrite
   - 20 atributos incluindo valores, categorias, datas, e metadados
   - 7 índices para otimizar consultas

2. **DTOs** (`apps/api/src/database/dto/index.ts`)
   - `CreateTransactionDto`: Para transações manuais
   - `CreateIntegrationTransactionDto`: Para transações de integrações
   - `UpdateTransactionDto`: Para atualizar transações
   - `TransactionFilterDto`: Para filtrar e buscar transações

3. **Service** (`apps/api/src/database/services/appwrite-transaction.service.ts`)
   - Gerencia toda a lógica de negócio
   - Interage com o Appwrite Database
   - Fornece métodos para CRUD e estatísticas

4. **Controller** (`apps/api/src/transactions/transactions.controller.ts`)
   - Expõe endpoints REST
   - Aplica autenticação JWT
   - Valida dados de entrada

## Estrutura de Dados

### Transaction Model

```typescript
interface Transaction {
  $id: string;                    // ID único do Appwrite
  $createdAt: string;             // Data de criação (Appwrite)
  $updatedAt: string;             // Data de atualização (Appwrite)
  user_id: string;                // ID do usuário
  amount: number;                 // Valor da transação
  type: 'income' | 'expense' | 'transfer';  // Tipo
  category: string;               // Categoria (ex: "Alimentação", "Salário")
  description?: string;           // Descrição opcional
  date: string;                   // Data da transação
  account_id?: string;            // ID da conta vinculada
  merchant?: string;              // Nome do estabelecimento
  currency: string;               // Moeda (ex: "BRL", "USD")
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  source: 'manual' | 'integration' | 'import';  // Origem
  integration_id?: string;        // ID da integração (se aplicável)
  integration_data?: string;      // Dados brutos da integração (JSON)
  tags?: string;                  // Tags (JSON array)
  location?: string;              // Localização (JSON)
  receipt_url?: string;           // URL do recibo
  is_recurring: boolean;          // É transação recorrente?
  recurring_pattern?: string;     // Padrão de recorrência (JSON)
  created_at: string;             // Data de criação (app)
  updated_at: string;             // Data de atualização (app)
}
```

## API Endpoints

### 1. Criar Transação Manual

**POST** `/transactions/manual`

Cria uma transação inserida manualmente pelo usuário através do frontend.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "user_123",
  "amount": 150.50,
  "type": "expense",
  "category": "Alimentação",
  "description": "Almoço no restaurante",
  "date": "2025-10-22T12:30:00Z",
  "merchant": "Restaurante ABC",
  "currency": "BRL",
  "status": "completed",
  "tags": ["almoço", "trabalho"],
  "location": {
    "latitude": -23.550520,
    "longitude": -46.633308,
    "address": "São Paulo, SP"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "$id": "trans_xyz",
    "user_id": "user_123",
    "amount": 150.50,
    "type": "expense",
    "category": "Alimentação",
    "description": "Almoço no restaurante",
    "date": "2025-10-22T12:30:00Z",
    "merchant": "Restaurante ABC",
    "currency": "BRL",
    "status": "completed",
    "source": "manual",
    "tags": "[\"almoço\",\"trabalho\"]",
    "location": "{\"latitude\":-23.55052,\"longitude\":-46.633308,\"address\":\"São Paulo, SP\"}",
    "is_recurring": false,
    "created_at": "2025-10-22T14:00:00Z",
    "updated_at": "2025-10-22T14:00:00Z"
  },
  "message": "Transaction created successfully"
}
```

---

### 2. Criar Transação via Integração

**POST** `/transactions/integration`

Cria uma transação importada de uma integração bancária ou serviço financeiro.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "user_123",
  "amount": 5000.00,
  "type": "income",
  "category": "Salário",
  "description": "Salário mensal",
  "date": "2025-10-01T00:00:00Z",
  "accountId": "account_456",
  "currency": "BRL",
  "status": "completed",
  "integrationId": "bank_integration_789",
  "integrationData": {
    "bankTransactionId": "TXN987654321",
    "bankName": "Banco XYZ",
    "rawData": { }
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "$id": "trans_abc",
    "user_id": "user_123",
    "amount": 5000.00,
    "type": "income",
    "category": "Salário",
    "source": "integration",
    "integration_id": "bank_integration_789",
    "status": "completed",
    ...
  },
  "message": "Transaction created from integration successfully"
}
```

---

### 3. Criar Múltiplas Transações (Bulk)

**POST** `/transactions/integration/bulk`

Cria múltiplas transações de uma vez, útil para sincronização de integrações.

**Body:**
```json
[
  {
    "userId": "user_123",
    "amount": 50.00,
    "type": "expense",
    "category": "Transporte",
    "date": "2025-10-21T08:00:00Z",
    "currency": "BRL",
    "integrationId": "bank_integration_789"
  },
  {
    "userId": "user_123",
    "amount": 30.00,
    "type": "expense",
    "category": "Alimentação",
    "date": "2025-10-21T12:00:00Z",
    "currency": "BRL",
    "integrationId": "bank_integration_789"
  }
]
```

**Response (201):**
```json
{
  "success": true,
  "data": [ /* array of created transactions */ ],
  "message": "2 transactions created successfully",
  "total": 2
}
```

---

### 4. Listar Transações com Filtros

**GET** `/transactions?userId=user_123&type=expense&startDate=2025-10-01&endDate=2025-10-31&limit=50&offset=0`

**Query Parameters:**
- `userId` (string): Filtrar por usuário
- `type` (enum): income | expense | transfer
- `category` (string): Categoria
- `status` (enum): pending | completed | failed | cancelled
- `source` (enum): manual | integration | import
- `startDate` (datetime): Data inicial
- `endDate` (datetime): Data final
- `minAmount` (number): Valor mínimo
- `maxAmount` (number): Valor máximo
- `search` (string): Busca em descrição
- `limit` (number): Limite de resultados (padrão: 50)
- `offset` (number): Offset para paginação (padrão: 0)

**Response (200):**
```json
{
  "success": true,
  "data": [ /* array of transactions */ ],
  "total": 120,
  "limit": 50,
  "offset": 0
}
```

---

### 5. Obter Transação por ID

**GET** `/transactions/:id`

**Response (200):**
```json
{
  "success": true,
  "data": { /* transaction object */ }
}
```

---

### 6. Atualizar Transação

**PUT** `/transactions/:id`

**Body:**
```json
{
  "amount": 200.00,
  "description": "Descrição atualizada",
  "category": "Nova Categoria"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated transaction */ },
  "message": "Transaction updated successfully"
}
```

---

### 7. Deletar Transação

**DELETE** `/transactions/:id`

**Response (204):** No Content

---

### 8. Obter Estatísticas

**GET** `/transactions/stats/:userId?startDate=2025-10-01&endDate=2025-10-31`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalIncome": 5000.00,
    "totalExpense": 2500.00,
    "balance": 2500.00,
    "transactionCount": 45,
    "categoryBreakdown": {
      "Alimentação": 800.00,
      "Transporte": 500.00,
      "Salário": 5000.00,
      "Lazer": 300.00
    }
  }
}
```

## Setup do Appwrite

### Criação da Collection

Execute o script de migração:

```bash
cd apps/api
./scripts/create-transactions-collection.sh
```

Este script irá:
1. Criar a collection `transactions` no database
2. Adicionar todos os 20 atributos
3. Criar os 7 índices para otimização

### Verificação Manual

Se preferir criar manualmente via Appwrite Console:

1. Acesse o Appwrite Console
2. Navegue até o Database `horizon_ai_db`
3. Crie uma nova Collection com ID `transactions`
4. Configure Row-Level Security como `true`
5. Adicione as permissões: `read("any")`, `write("any")`
6. Crie os atributos conforme o schema em `appwrite-schema.ts`
7. Crie os índices listados no schema

## Uso no Frontend

### Exemplo: Adicionar Transação Manual

```typescript
import axios from 'axios';

const createTransaction = async (transactionData: CreateTransactionDto) => {
  try {
    const response = await axios.post(
      'http://localhost:4000/transactions/manual',
      transactionData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};
```

### Exemplo: Listar Transações do Usuário

```typescript
const getTransactions = async (userId: string, filters?: TransactionFilterDto) => {
  try {
    const params = new URLSearchParams({
      userId,
      ...filters,
    });
    
    const response = await axios.get(
      `http://localhost:4000/transactions?${params}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
```

## Integrações Bancárias

### Fluxo de Integração

1. **Usuário conecta banco** através do frontend
2. **Sistema autentica** com a API do banco (ex: Plaid, Open Banking)
3. **API busca transações** do banco
4. **Sistema transforma** os dados para o formato interno
5. **Cria transações** usando o endpoint `/transactions/integration/bulk`
6. **Sincronização periódica** atualiza novas transações

### Exemplo de Integração

```typescript
// Exemplo conceitual de integração com banco
const syncBankTransactions = async (userId: string, bankConnection: BankConnection) => {
  // 1. Buscar transações do banco
  const bankTransactions = await bankAPI.getTransactions(
    bankConnection.accessToken,
    { startDate: lastSyncDate, endDate: new Date() }
  );

  // 2. Transformar para o formato da API
  const transactions = bankTransactions.map(bt => ({
    userId,
    amount: bt.amount,
    type: bt.amount > 0 ? 'income' : 'expense',
    category: mapCategory(bt.category),
    description: bt.description,
    date: bt.date,
    accountId: bt.accountId,
    merchant: bt.merchantName,
    currency: bt.isoCurrencyCode,
    status: 'completed',
    integrationId: bankConnection.id,
    integrationData: { originalTransaction: bt },
  }));

  // 3. Criar em lote
  const response = await axios.post(
    'http://localhost:4000/transactions/integration/bulk',
    transactions,
    {
      headers: { Authorization: `Bearer ${userToken}` },
    }
  );

  return response.data;
};
```

## Categorização Automática

As transações de integração podem usar IA/ML para categorização automática:

```typescript
const categorizeTransaction = (description: string, merchant: string) => {
  // Lógica de categorização usando padrões ou ML
  const categories = {
    'supermercado|mercado|padaria': 'Alimentação',
    'uber|taxi|metro': 'Transporte',
    'netflix|spotify|amazon prime': 'Assinaturas',
    'farmacia|drogaria': 'Saúde',
    // ... mais regras
  };

  for (const [pattern, category] of Object.entries(categories)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(description) || regex.test(merchant)) {
      return category;
    }
  }

  return 'Outros';
};
```

## Segurança

### Autenticação
- Todos os endpoints requerem autenticação JWT via `JwtAuthGuard`
- Token deve ser incluído no header: `Authorization: Bearer <token>`

### Autorização
- Usuários só podem ver/editar suas próprias transações
- Validação do `userId` contra o token JWT (implementar no controller)

### Validação
- Todos os DTOs usam `class-validator` para validação
- Valores negativos não são permitidos (use o campo `type`)
- Datas devem estar no formato ISO 8601

## Próximos Passos

1. **Implementar Row-Level Security no Appwrite**
   - Garantir que usuários só vejam suas transações
   
2. **Adicionar endpoints de categorias**
   - CRUD de categorias personalizadas por usuário
   
3. **Implementar transações recorrentes**
   - Job scheduler para criar transações recorrentes automaticamente
   
4. **Dashboard de analytics**
   - Gráficos de gastos por categoria
   - Tendências ao longo do tempo
   - Comparação mês a mês

5. **Notificações**
   - Alertas de gastos acima da média
   - Notificações de transações grandes
   - Lembretes de contas a pagar

6. **Exportação de dados**
   - CSV, Excel, PDF
   - Relatórios mensais/anuais

7. **Importação de arquivos**
   - Upload de extratos bancários (CSV/OFX)
   - Parser de diferentes formatos

## Troubleshooting

### Erro: "Appwrite not properly initialized"
- Verifique se as variáveis de ambiente estão configuradas
- Confirme que o `AppwriteModule` está importado

### Erro: Collection não existe
- Execute o script de migração: `./scripts/create-transactions-collection.sh`
- Ou crie manualmente via Appwrite Console

### Transações não aparecem
- Verifique as permissões da collection
- Confirme que Row-Level Security está configurado
- Valide que o `userId` está correto

### Performance lenta
- Verifique se os índices foram criados
- Use paginação adequada (limit/offset)
- Considere adicionar índices compostos para queries complexas
