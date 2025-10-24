# Appwrite - Boas Práticas e Guia de Uso

## Índice

1. [Configuração](#configuração)
2. [Autenticação](#autenticação)
3. [Banco de Dados](#banco-de-dados)
4. [Segurança](#segurança)
5. [Performance](#performance)
6. [Troubleshooting](#troubleshooting)

## Configuração

### Variáveis de Ambiente

**Obrigatórias (Server-side):**

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
```

**Recomendadas (Client-side):**

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
```

### Validação

Execute a validação antes de iniciar o desenvolvimento:

```bash
pnpm validate:appwrite
```

## Autenticação

### ✅ Boas Práticas

1. **Use a nova API de objetos:**

```typescript
// ✅ Correto (novo)
await account.create({ userId, email, password, name });
await account.createEmailPasswordSession({ email, password });
await account.deleteSession({ sessionId: 'current' });

// ❌ Evite (deprecated)
await account.create(userId, email, password, name);
await account.createEmailPasswordSession(email, password);
await account.deleteSession('current');
```

2. **Sempre trate erros do Appwrite:**

```typescript
import { AppwriteException } from 'node-appwrite';

try {
  await account.create({ userId, email, password, name });
} catch (error) {
  if (error instanceof AppwriteException) {
    if (error.code === 409) {
      // Email já existe
    } else if (error.code === 401) {
      // Credenciais inválidas
    }
  }
}
```

3. **Sincronize Auth com Database:**

```typescript
// Sempre crie dados do usuário no database após criar no Auth
const user = await account.create({ userId, email, password, name });
await userService.initializeUserDataWithId(user.$id, { email, ... });
```

## Banco de Dados

### ✅ Boas Práticas

1. **Use o Adapter para compatibilidade:**

```typescript
import { getAppwriteDatabases } from '@/lib/appwrite/client';

const databases = getAppwriteDatabases();
// Funciona com Databases ou TablesDB automaticamente
```

2. **Estruture dados JSON corretamente:**

```typescript
// ✅ Correto - campos indexados na raiz
const transaction = {
  user_id: userId,
  amount: 100,
  type: 'income',
  date: new Date().toISOString(),
  status: 'completed',
  data: JSON.stringify({
    // Campos não-indexados no JSON
    category: 'salary',
    description: 'Monthly salary',
    merchant: 'Company Inc',
  })
};

// ❌ Evite - tudo no JSON (não pode ser indexado/filtrado)
const transaction = {
  data: JSON.stringify({
    user_id: userId,
    amount: 100,
    type: 'income',
    // ...
  })
};
```

3. **Use Queries para filtros eficientes:**

```typescript
import { Query } from 'node-appwrite';

const queries = [
  Query.equal('user_id', userId),
  Query.greaterThanEqual('date', startDate),
  Query.lessThanEqual('date', endDate),
  Query.orderDesc('date'),
  Query.limit(50),
];

const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.TRANSACTIONS, queries);
```

4. **Implemente paginação:**

```typescript
const page = 1;
const limit = 25;
const offset = (page - 1) * limit;

const queries = [Query.equal('user_id', userId), Query.limit(limit), Query.offset(offset)];
```

5. **Parse JSON fields com segurança:**

```typescript
function parseJSON<T>(value: string | undefined, defaultValue: T): T {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}

const data = parseJSON(transaction.data, {});
```

## Segurança

### ✅ Boas Práticas

1. **Nunca exponha API Key no client:**

```typescript
// ✅ Correto - Server-side only
const apiKey = process.env.APPWRITE_API_KEY;

// ❌ NUNCA faça isso
const apiKey = process.env.NEXT_PUBLIC_APPWRITE_API_KEY;
```

2. **Use Row-Level Security (RLS):**

```typescript
// Configure no Appwrite Console:
// - rowSecurity: true
// - Permissions: ['read("user:{userId}")', 'write("user:{userId}")']
```

3. **Valide dados antes de salvar:**

```typescript
import { z } from 'zod';

const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['income', 'expense', 'transfer']),
  date: z.string().datetime(),
});

const validated = transactionSchema.parse(data);
```

4. **Sanitize user input:**

```typescript
function sanitizeString(input: string): string {
  return input.trim().slice(0, 255);
}
```

## Performance

### ✅ Boas Práticas

1. **Use índices para queries frequentes:**

```typescript
// Configure índices no Appwrite Console para:
// - user_id (queries por usuário)
// - date (ordenação por data)
// - type (filtros por tipo)
// - status (filtros por status)
```

2. **Limite resultados de queries:**

```typescript
// ✅ Sempre use limit
Query.limit(50);

// ❌ Evite queries sem limite
await databases.listDocuments(DATABASE_ID, COLLECTIONS.TRANSACTIONS);
```

3. **Use select para campos específicos:**

```typescript
// ✅ Busque apenas campos necessários
Query.select(['$id', 'amount', 'date', 'type']);

// ❌ Evite buscar todos os campos quando não necessário
```

4. **Cache resultados quando apropriado:**

```typescript
// Next.js 16 - use cache components
export async function TransactionsList() {
  'use cache';
  const transactions = await getTransactions();
  return <div>{/* ... */}</div>;
}
```

5. **Batch operations quando possível:**

```typescript
// ✅ Crie múltiplos documentos em paralelo
await Promise.all(
  transactions.map((t) => databases.createDocument(DATABASE_ID, COLLECTIONS.TRANSACTIONS, ID.unique(), t)),
);
```

## Troubleshooting

### Erro: "Appwrite client not initialized"

**Causa:** Cliente não foi inicializado antes do uso.

**Solução:**

```typescript
import { initializeAppwrite } from '@/lib/appwrite/client';

// No app/layout.tsx (já configurado)
initializeAppwrite();
```

### Erro: "TablesDB is not available"

**Causa:** SDK não suporta TablesDB ou servidor desatualizado.

**Solução:** O adapter faz fallback automático para Databases. Atualize o SDK:

```bash
pnpm update node-appwrite
```

### Erro 401: "Unauthorized"

**Causas possíveis:**

1. API Key inválida ou expirada
2. Permissões insuficientes
3. Sessão expirada

**Solução:**

1. Verifique API Key no Appwrite Console
2. Confirme permissões das collections
3. Renove sessão do usuário

### Erro 404: "Document not found"

**Causas possíveis:**

1. ID do documento incorreto
2. Collection não existe
3. Database ID incorreto

**Solução:**

1. Verifique IDs no Appwrite Console
2. Execute migrações: `pnpm migrate:up`
3. Confirme DATABASE_ID no .env

### Erro 409: "Document already exists"

**Causa:** Tentativa de criar documento com ID duplicado.

**Solução:**

```typescript
// Use ID.unique() para gerar IDs únicos
import { ID } from 'node-appwrite';

const id = ID.unique();
```

### Performance lenta

**Causas possíveis:**

1. Queries sem índices
2. Muitos documentos retornados
3. Campos JSON muito grandes

**Solução:**

1. Adicione índices no Appwrite Console
2. Use paginação e limit
3. Otimize estrutura de dados

## Comandos Úteis

```bash
# Validar configuração
pnpm validate:appwrite

# Validar variáveis de ambiente
pnpm validate:env

# Executar migrações
pnpm migrate:up
pnpm migrate:status

# Executar testes
pnpm test:auth
pnpm test:accounts
pnpm test:transactions

# Verificar tipos
pnpm typecheck
```

## Recursos Adicionais

- [Documentação Appwrite](https://appwrite.io/docs)
- [SDK Node.js](https://appwrite.io/docs/sdks#server)
- [Queries](https://appwrite.io/docs/queries)
- [Permissions](https://appwrite.io/docs/permissions)
- [Best Practices](https://appwrite.io/docs/best-practices)

## Checklist de Implementação

- [ ] Variáveis de ambiente configuradas
- [ ] Cliente Appwrite inicializado
- [ ] Migrações executadas
- [ ] Índices criados no Console
- [ ] Row-Level Security configurado
- [ ] Validação de dados implementada
- [ ] Error handling implementado
- [ ] Testes executados com sucesso
- [ ] Performance otimizada
- [ ] Documentação atualizada
