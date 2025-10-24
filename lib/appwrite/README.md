# Appwrite Integration

Este diretório contém a integração com o Appwrite para o Horizon AI.

## Arquivos

### `client.ts`

Cliente principal do Appwrite com inicialização singleton e funções getter para serviços.

**Principais funções:**

- `initializeAppwrite()` - Inicializa o cliente Appwrite (chamado automaticamente no layout)
- `getAppwriteClient()` - Retorna instância do Client
- `getAppwriteAccount()` - Retorna serviço de Account (autenticação)
- `getAppwriteDatabases()` - Retorna adapter de Databases/TablesDB
- `getAppwriteTables()` - Retorna instância raw de TablesDB (quando disponível)
- `getAppwriteUsers()` - Retorna serviço de Users (gerenciamento server-side)
- `generateId()` - Gera ID único para documentos

**Características:**

- Suporte automático para TablesDB quando disponível no SDK
- Fallback para Databases API quando TablesDB não está disponível
- Adapter transparente que mantém compatibilidade com código legado
- Inicialização lazy com cache de instâncias

### `adapter.ts`

Adapter que fornece compatibilidade entre a API legada de Databases e a nova API de TablesDB.

**Métodos mapeados:**

- `listDocuments()` → `listRows()`
- `getDocument()` → `getRow()`
- `createDocument()` → `createRow()`
- `updateDocument()` → `updateRow()`
- `deleteDocument()` → `deleteRow()`

**Benefícios:**

- Código existente continua funcionando sem alterações
- Transição suave para TablesDB quando disponível
- Fallback automático para Databases API

### `schema.ts`

Definições de schema para todas as collections do Appwrite.

**Collections:**

- `users` - Dados principais do usuário
- `user_profiles` - Perfil do usuário
- `user_preferences` - Preferências do usuário
- `user_settings` - Configurações do usuário
- `transactions` - Transações financeiras
- `accounts` - Contas bancárias
- `credit_cards` - Cartões de crédito

**Características:**

- TypeScript types para todas as collections
- Schemas completos com atributos e índices
- Documentação de estrutura de dados JSON

### `database.ts`

Funções helper para operações comuns de banco de dados.

**Funções principais:**

- `listDocuments()` - Lista documentos com paginação
- `getDocument()` - Busca documento por ID
- `createDocument()` - Cria novo documento
- `updateDocument()` - Atualiza documento existente
- `deleteDocument()` - Remove documento
- `QueryBuilder` - Helpers para construir queries
- `buildPaginationQueries()` - Helper de paginação
- `parseJSONField()` / `stringifyJSONField()` - Helpers para campos JSON

## Uso

### Inicialização

```typescript
import { initializeAppwrite } from '@/lib/appwrite/client';

// Inicializado automaticamente no app/layout.tsx
initializeAppwrite();
```

### Autenticação

```typescript
import { getAppwriteAccount } from '@/lib/appwrite/client';

const account = getAppwriteAccount();
const user = await account.create({ userId, email, password, name });
```

### Banco de Dados

```typescript
import { getAppwriteDatabases } from '@/lib/appwrite/client';
import { COLLECTIONS, DATABASE_ID } from '@/lib/appwrite/schema';

const databases = getAppwriteDatabases();
const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS);
```

### Queries

```typescript
import { Query } from 'node-appwrite';

const queries = [Query.equal('user_id', userId), Query.orderDesc('created_at'), Query.limit(10)];

const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.TRANSACTIONS, queries);
```

## Variáveis de Ambiente

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
```

## Migrações

As migrações do banco de dados estão em `lib/database/migrations/`.

Para executar migrações:

```bash
pnpm migrate:up
pnpm migrate:down
pnpm migrate:status
```

## Boas Práticas

1. **Sempre use o adapter** - Use `getAppwriteDatabases()` em vez de acessar diretamente
2. **Campos JSON** - Use o campo `data` para armazenar dados não-indexados
3. **Validação** - Valide dados antes de salvar no banco
4. **Error handling** - Sempre trate erros do Appwrite (AppwriteException)
5. **Tipos** - Use os tipos TypeScript definidos em `schema.ts`
6. **Queries** - Use Query builders para construir queries complexas
7. **Paginação** - Sempre implemente paginação para listas grandes

## Troubleshooting

### TablesDB não disponível

Se você receber erro sobre TablesDB não estar disponível, verifique:

1. Versão do SDK `node-appwrite` >= 20.0.0
2. Servidor Appwrite atualizado
3. O adapter fará fallback automático para Databases

### Erro de inicialização

Se o cliente não inicializar:

1. Verifique as variáveis de ambiente
2. Confirme que `initializeAppwrite()` foi chamado
3. Verifique logs do console para detalhes

### Erros de permissão

Se receber erros 401/403:

1. Verifique a API key no console do Appwrite
2. Confirme permissões das collections
3. Verifique se `rowSecurity` está configurado corretamente
