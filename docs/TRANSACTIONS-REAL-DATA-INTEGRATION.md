# Transactions Screen - Real Data Integration

## Mudanças Implementadas

### 1. Criado Hook Customizado `useTransactions`

**Arquivo:** `apps/web/src/hooks/useTransactions.ts`

Hook React para gerenciar transações com a API:

```typescript
const { 
  transactions,    // Array de transações da API
  isLoading,       // Estado de carregamento
  error,           // Mensagem de erro (se houver)
  total,           // Total de transações no servidor
  refetch          // Função para recarregar dados
} = useTransactions(userId);
```

**Funcionalidades:**
- Busca automática de transações ao montar o componente
- Suporte a filtros (tipo, status, categoria, data)
- Paginação (limit e offset)
- Refresh manual via `refetch()`
- Tratamento de erros

**Funções auxiliares:**
- `createTransaction()` - Criar nova transação manual
- `deleteTransaction()` - Deletar transação

### 2. Atualizado `TransactionsScreen`

**Arquivo:** `apps/web/src/screens/TransactionsScreen.tsx`

**Mudanças principais:**

#### Antes (Mock Data):
```typescript
const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
```

#### Depois (Real Data):
```typescript
const { 
  transactions: apiTransactions, 
  isLoading: isLoadingTransactions, 
  error: transactionsError,
  refetch 
} = useTransactions(userId);

// Conversão automática de API data para UI format
const transactions: Transaction[] = useMemo(() => {
  return apiTransactions.map((apiTx) => ({
    id: apiTx.$id,
    description: apiTx.description || apiTx.merchant || 'Transaction',
    amount: apiTx.type === 'income' ? Math.abs(apiTx.amount) : -Math.abs(apiTx.amount),
    date: apiTx.date,
    bankName: apiTx.accountId || 'Manual Entry',
    category: apiTx.category || 'Uncategorized',
    // ... outros campos
  }));
}, [apiTransactions]);
```

#### Função de Adicionar Transação (Agora Assíncrona):
```typescript
const handleAddNewTransaction = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    await createTransaction({
      userId,
      amount: finalAmount,
      type: transactionType,
      category: newTransaction.category,
      description: newTransaction.description,
      date: new Date(newTransaction.date).toISOString(),
      currency: 'BRL',
      // ... outros campos
    });

    // Atualiza lista automaticamente
    await refetch();
    
    setIsAddModalOpen(false);
    onShowToast("Transaction added successfully!", "success");
  } catch (error) {
    onShowToast("Failed to add transaction. Please try again.", "error");
  }
};
```

### 3. Atualizado `api.ts`

**Arquivo:** `apps/web/src/config/api.ts`

Adicionados endpoints de transações:

```typescript
transactions: {
  list: `${API_URL}/transactions`,
  create: `${API_URL}/transactions/manual`,
  get: (id: string) => `${API_URL}/transactions/${id}`,
  update: (id: string) => `${API_URL}/transactions/${id}`,
  delete: (id: string) => `${API_URL}/transactions/${id}`,
  stats: (userId: string) => `${API_URL}/transactions/stats/${userId}`,
}
```

### 4. Atualizado Tipo `User`

**Arquivo:** `apps/web/src/types.ts`

Adicionados campos opcionais:

```typescript
export interface User {
  id?: string;        // ✨ NOVO - Para passar para API
  name: string;
  role: UserRole;
  email?: string;     // ✨ NOVO - Para referência
}
```

### 5. Atualizado `App.tsx`

Passando `userId` para o componente:

```typescript
case "dashboard/transactions":
  return <TransactionsScreen 
    isLoading={isLoading} 
    onShowToast={showToast} 
    userId={user?.id}  // ✨ NOVO
  />;
```

## Formato de Dados

### API Response Format
```json
{
  "success": true,
  "data": [
    {
      "$id": "tx_123",
      "userId": "user_456",
      "amount": 150.50,
      "type": "expense",
      "date": "2025-01-22T10:30:00Z",
      "status": "completed",
      "category": "food",
      "description": "Lunch at Restaurant",
      "currency": "BRL",
      "source": "manual",
      "merchant": "Restaurant ABC",
      "createdAt": "2025-01-22T10:30:00Z",
      "updatedAt": "2025-01-22T10:30:00Z"
    }
  ],
  "total": 42,
  "limit": 50,
  "offset": 0
}
```

### UI Transaction Format
```typescript
{
  id: "tx_123",
  description: "Lunch at Restaurant",
  amount: -150.50,  // Negative for expenses, positive for income
  date: "2025-01-22T10:30:00Z",
  bankName: "Manual Entry",
  category: "food",
  type: "credit",
  icon: FoodIcon,
  notes: "Lunch at Restaurant"
}
```

## Mapeamento de Campos

| API Field | UI Field | Transformation |
|-----------|----------|----------------|
| `$id` | `id` | Direct mapping |
| `description` ou `merchant` | `description` | Fallback: "Transaction" |
| `amount` + `type` | `amount` | Income: positive, Expense: negative |
| `date` | `date` | Direct mapping |
| `accountId` | `bankName` | Fallback: "Manual Entry" |
| `category` | `category` | Fallback: "Uncategorized" |
| `source` | `type` | Mapped to credit/debit/pix/boleto |

## Estado de Carregamento

O componente agora gerencia dois estados de carregamento:

1. **`parentIsLoading`** - Carregamento geral da aplicação (props)
2. **`isLoadingTransactions`** - Carregamento específico das transações (hook)

Mostra skeleton se **qualquer um** estiver carregando:

```typescript
if (isLoadingTransactions || parentIsLoading) {
  return <TransactionsScreenSkeleton />;
}
```

## Tratamento de Erros

Erros da API são exibidos automaticamente via toast:

```typescript
useEffect(() => {
  if (transactionsError) {
    onShowToast(`Error loading transactions: ${transactionsError}`, "error");
  }
}, [transactionsError, onShowToast]);
```

## Filtros e Busca

Os filtros continuam funcionando do lado do cliente. Para melhor performance com grandes datasets, considere:

1. Passar filtros para a API via `refetch({ type: 'expense', category: 'food' })`
2. Implementar paginação com scroll infinito
3. Debounce na busca para reduzir chamadas à API

## Benefícios

✅ **Dados Reais** - Transações vêm do banco de dados Appwrite  
✅ **Sincronização** - Mudanças refletem imediatamente  
✅ **Offline-First Ready** - Estrutura permite adicionar cache local  
✅ **Type-Safe** - TypeScript em toda a cadeia  
✅ **Reutilizável** - Hook pode ser usado em outros componentes  
✅ **Testável** - Lógica separada facilita testes  

## Próximos Passos

### Curto Prazo
- [ ] Adicionar autenticação JWT nos headers das requisições
- [ ] Implementar paginação server-side
- [ ] Cache de transações com React Query ou SWR
- [ ] Indicador de loading inline durante refresh

### Médio Prazo
- [ ] Filtros server-side para melhor performance
- [ ] Suporte a edição inline de transações
- [ ] Bulk operations (deletar múltiplas)
- [ ] Export de transações (CSV/PDF)

### Longo Prazo
- [ ] Real-time updates via WebSocket
- [ ] Sincronização offline com service workers
- [ ] Undo/Redo de operações
- [ ] Analytics e insights automáticos

## Como Testar

### 1. Verificar se a API está rodando
```bash
cd apps/api
pnpm dev
```

### 2. Criar variável de ambiente no frontend
```bash
# apps/web/.env
VITE_API_URL=http://localhost:3000/api
```

### 3. Executar o frontend
```bash
cd apps/web
pnpm dev
```

### 4. Testar funcionalidades
1. ✅ Fazer login
2. ✅ Navegar para Transactions
3. ✅ Ver lista de transações do banco
4. ✅ Adicionar nova transação
5. ✅ Verificar se aparece na lista
6. ✅ Buscar e filtrar transações
7. ✅ Ver detalhes de uma transação

### 5. Verificar no Appwrite Console
- Login em https://cloud.appwrite.io
- Verificar database `horizon_ai_db`
- Conferir tabela `transactions`
- Ver registros criados

## Troubleshooting

### Problema: Não carrega transações
**Solução:** 
1. Verificar se `user.id` está definido
2. Conferir console do navegador para erros
3. Verificar se API_URL está configurado
4. Testar endpoint diretamente: `curl http://localhost:3000/api/transactions?userId=xxx`

### Problema: Erro 401 Unauthorized
**Solução:**
1. Implementar autenticação JWT
2. Passar token nos headers das requisições
3. Verificar se cookie de sessão está sendo enviado

### Problema: Transações não aparecem após adicionar
**Solução:**
1. Verificar se `refetch()` está sendo chamado
2. Conferir resposta da API no Network tab
3. Ver se transaction foi criada no banco (Appwrite Console)

## Observações Importantes

⚠️ **userId Temporário**: Atualmente usa "default-user" se não houver userId. Isso é para desenvolvimento. Em produção, sempre deve haver um userId válido.

⚠️ **Sem Autenticação**: As requisições ainda não incluem tokens JWT. Adicionar quando sistema de auth estiver completo.

⚠️ **Performance**: Com muitas transações, considerar:
- Virtualização de lista (react-window)
- Paginação server-side
- Cache agressivo

⚠️ **Conversão de Tipos**: O mapeamento de `type` da API para `TransactionType` da UI é simplificado. Refinar quando houver dados reais de integrações bancárias.
