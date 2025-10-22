# Transactions Metadata Field Migration

## Overview

A tabela `transactions` foi otimizada para trabalhar dentro do limite de colunas do Appwrite. Consolidamos 9 campos opcionais em um único campo JSON chamado `metadata`.

## Changes Summary

### Before (20 columns)
A migration original tinha 20 colunas individuais:
- Core fields: user_id, amount, type, category, description, date, currency, status, source, created_at, updated_at
- Optional fields: account_id, merchant, integration_id, integration_data, tags, location, receipt_url, is_recurring, recurring_pattern

### After (12 columns)
A migration otimizada tem 12 colunas:
- Core fields: user_id, amount, type, category, description, date, currency, status, source, created_at, updated_at
- **metadata** (JSON field, 16KB): Consolida os 9 campos opcionais

## Metadata Structure

O campo `metadata` é um JSON string que armazena:

```typescript
interface TransactionMetadata {
  account_id?: string;           // ID da conta bancária
  merchant?: string;             // Nome do comerciante
  integration_id?: string;       // ID da integração (banco, fintech)
  integration_data?: any;        // Dados brutos da integração
  tags?: string[];               // Tags para categorização
  location?: {                   // Localização da transação
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  receipt_url?: string;          // URL do comprovante
  is_recurring?: boolean;        // É recorrente?
  recurring_pattern?: {          // Padrão de recorrência
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };
}
```

## API Contract (Unchanged)

A API continua recebendo e retornando os mesmos campos. O controller automaticamente:
- **Serializa** campos opcionais para metadata ao criar/atualizar
- **Desserializa** metadata para campos individuais nas respostas

### Example Request (unchanged)
```json
POST /transactions/manual
{
  "userId": "user123",
  "amount": 150.50,
  "type": "expense",
  "category": "food",
  "description": "Lunch",
  "date": "2025-01-22",
  "currency": "BRL",
  "accountId": "acc_123",
  "merchant": "Restaurant ABC",
  "tags": ["lunch", "work"],
  "receiptUrl": "https://example.com/receipt.pdf"
}
```

### Example Response (unchanged)
```json
{
  "success": true,
  "data": {
    "$id": "tx_abc123",
    "userId": "user123",
    "amount": 150.50,
    "type": "expense",
    "category": "food",
    "description": "Lunch",
    "date": "2025-01-22",
    "currency": "BRL",
    "status": "completed",
    "source": "manual",
    "accountId": "acc_123",
    "merchant": "Restaurant ABC",
    "tags": ["lunch", "work"],
    "receiptUrl": "https://example.com/receipt.pdf",
    "createdAt": "2025-01-22T10:30:00Z",
    "updatedAt": "2025-01-22T10:30:00Z"
  }
}
```

## Database Schema

### Columns (12)
1. **user_id** (string, 255) - Required
2. **amount** (double) - Required
3. **type** (enum: income, expense, transfer) - Required
4. **category** (string, 100) - Required
5. **description** (string, 1000) - Optional
6. **date** (datetime) - Required
7. **currency** (string, 3) - Required, default: 'BRL'
8. **status** (enum: pending, completed, failed, cancelled) - Required, default: 'completed'
9. **source** (enum: manual, integration, import) - Required
10. **metadata** (string, 16000) - Optional JSON field
11. **created_at** (datetime) - Required
12. **updated_at** (datetime) - Required

### Indexes (6)
1. idx_user_id (user_id ASC)
2. idx_date (date DESC)
3. idx_type (type)
4. idx_category (category)
5. idx_status (status)
6. idx_source (source)

## Implementation Details

### Service Layer
`AppwriteTransactionService` handles serialization/deserialization:

```typescript
// CREATE: Serialize optional fields to metadata
const metadata = {};
if (data.accountId) metadata.account_id = data.accountId;
if (data.merchant) metadata.merchant = data.merchant;
// ... etc
payload.metadata = JSON.stringify(metadata);

// READ: Returns raw metadata string
return {
  ...document,
  metadata: document.metadata
};
```

### Controller Layer
`TransactionsController` expands metadata for API responses:

```typescript
private formatTransactionResponse(transaction: Transaction) {
  const metadata = JSON.parse(transaction.metadata || '{}');
  
  return {
    ...transaction,
    // Expand metadata fields
    accountId: metadata.account_id,
    merchant: metadata.merchant,
    integrationId: metadata.integration_id,
    // ... etc
    metadata: undefined, // Remove raw metadata
  };
}
```

## Migration Files

### Main Migration
`apps/api/src/database/migrations/20251022_000007_create_transactions_table.ts`

### Schema Definition
`apps/api/src/database/appwrite-schema.ts` - Updated Transaction interface and transactionsSchema

### Service
`apps/api/src/database/services/appwrite-transaction.service.ts` - Handles metadata serialization

### Controller
`apps/api/src/transactions/transactions.controller.ts` - Handles metadata deserialization for API responses

## Testing the Migration

1. **Run the migration:**
   ```bash
   cd apps/api
   pnpm migrate:up
   ```

2. **Verify the table:**
   ```bash
   # Check Appwrite console or use API
   curl http://localhost:3000/api/health
   ```

3. **Test transaction creation:**
   ```bash
   # Create a manual transaction
   curl -X POST http://localhost:3000/api/transactions/manual \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "userId": "user123",
       "amount": 50.00,
       "type": "expense",
       "category": "food",
       "date": "2025-01-22",
       "currency": "BRL",
       "accountId": "acc_123",
       "merchant": "Coffee Shop"
     }'
   ```

4. **Verify metadata storage:**
   Check Appwrite console to see that optional fields are stored in the metadata JSON column.

## Benefits

1. **Appwrite Compliance**: Works within column limits
2. **API Compatibility**: No changes required in frontend
3. **Flexibility**: Easy to add new optional fields to metadata
4. **Performance**: Single JSON field is faster than many small columns
5. **Scalability**: Can store up to 16KB of metadata per transaction

## Limitations

1. **No Direct Indexing**: Cannot create indexes on metadata sub-fields
2. **Query Limitations**: Cannot filter by metadata sub-fields directly (must filter in application layer)
3. **Size Limit**: Maximum 16KB for metadata JSON

## Future Considerations

If you need to query by integration_id or other metadata fields frequently:
1. Create a separate `transaction_integrations` table
2. Move integration-specific fields there
3. Link via foreign key

For now, the consolidated metadata approach provides the best balance of simplicity and compliance with Appwrite limits.
