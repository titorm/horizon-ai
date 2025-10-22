# AI Insights System - Real-Time Financial Analysis

## Visão Geral

O sistema de **AI Insights** analisa as transações do usuário em tempo real e gera insights financeiros personalizados baseados em padrões de gastos, histórico e projeções.

## Funcionalidades Implementadas

### 1. **Análise de Gastos Anormais** 🔍

**Tipo:** `UNUSUAL_SPENDING`

**Como Funciona:**
- Compara gastos do mês atual com a média dos meses anteriores
- Agrupa transações por categoria
- Identifica aumentos de gastos superiores a 30%
- Considera apenas gastos significativos (> R$ 100)

**Exemplo de Insight:**
```
Title: "Higher than usual spending in "Dining""
Description: "Your spending in this category is up 45% this month compared 
to your average. You've spent R$ 1,450.00 vs. average of R$ 1,000.00. 
Keeping an eye on this can help you stay on budget."
```

**Critérios de Exibição:**
- ✅ Precisa ter transações no mês atual
- ✅ Precisa ter histórico de meses anteriores para comparação
- ✅ Aumento deve ser > 30%
- ✅ Valor deve ser > R$ 100
- ✅ Mostra no máximo 2 categorias com maior aumento percentual

---

### 2. **Projeção de Fluxo de Caixa** 📊

**Tipo:** `CASH_FLOW_FORECAST`

**Como Funciona:**
- Analisa receitas e despesas do mês atual
- Calcula média diária de gastos
- Projeta gastos até o final do mês
- Compara com renda esperada
- Gera previsão de superávit ou déficit

**Exemplo de Insight (Positivo):**
```
Title: "Positive Cash Flow Forecast"
Description: "Based on your income and spending patterns, you're on track 
to have a surplus of ~R$ 3,200 this month. A great opportunity to save 
or invest!"
```

**Exemplo de Insight (Negativo):**
```
Title: "Watch Your Cash Flow"
Description: "Your projected expenses may exceed your income by ~R$ 1,500 
this month. Consider reviewing your spending to stay on track."
```

**Critérios de Exibição:**
- ✅ Precisa ter pelo menos 10 transações
- ✅ Precisa ter histórico para calcular médias
- ✅ Superávit/déficit deve ser > R$ 100 (positivo ou negativo)

---

## Estrutura de Dados

### Transaction (API Format)
```typescript
interface ApiTransaction {
  $id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category?: string;
  date: string;
  createdAt: string;
}
```

### Financial Insight (Output)
```typescript
interface FinancialInsight {
  id: string;
  type: 'SAVINGS_OPPORTUNITY' | 'UNUSUAL_SPENDING' | 'CASH_FLOW_FORECAST';
  title: string;
  description: string;
  actionText: string;
}
```

---

## Algoritmos de Análise

### Análise de Gastos por Categoria

```typescript
// 1. Separar transações por período
currentMonth = transactions.filter(tx => 
  tx.date.month === now.month && 
  tx.type === 'expense'
);

previousMonths = transactions.filter(tx => 
  tx.date < now.month && 
  tx.type === 'expense'
);

// 2. Calcular gastos por categoria
categorySpending = {
  category: string,
  currentMonth: number,
  previousMonths: number,
  transactionCount: number
};

// 3. Calcular média dos meses anteriores
avgPrevious = previousMonths / numberOfMonths;

// 4. Calcular aumento percentual
percentageIncrease = ((currentMonth - avgPrevious) / avgPrevious) * 100;

// 5. Filtrar categorias com aumento > 30%
unusualCategories = categories.filter(cat => 
  cat.percentageIncrease > 30 && 
  cat.currentMonth > 100
);
```

### Projeção de Fluxo de Caixa

```typescript
// 1. Calcular gastos diários até agora
dailyAvgExpense = currentMonthExpenses / currentDay;

// 2. Projetar gastos restantes
daysRemaining = daysInMonth - currentDay;
estimatedRemainingExpenses = dailyAvgExpense * daysRemaining;

// 3. Calcular total estimado do mês
estimatedTotalExpenses = currentMonthExpenses + estimatedRemainingExpenses;

// 4. Comparar com renda esperada
estimatedTotalIncome = max(currentMonthIncome, avgPreviousIncome);
estimatedSurplus = estimatedTotalIncome - estimatedTotalExpenses;

// 5. Gerar insight se |surplus| > R$ 100
if (estimatedSurplus > 100) {
  return "Positive Cash Flow";
} else if (estimatedSurplus < -100) {
  return "Watch Your Cash Flow";
}
```

---

## Configuração e Personalização

### Ajustar Limites de Detecção

**Arquivo:** `apps/web/src/hooks/useFinancialInsights.ts`

```typescript
// Limiar de aumento percentual (padrão: 30%)
if (percentageIncrease > 30) { // <- Ajustar aqui

// Valor mínimo significativo (padrão: R$ 100)
if (cat.currentMonth > 100 && avgPrevious > 0) { // <- Ajustar aqui

// Número máximo de insights de gastos anormais (padrão: 2)
unusualSpending.slice(0, 2).forEach(...) // <- Ajustar aqui

// Número mínimo de transações para projeção (padrão: 10)
if (transactions.length > 10) { // <- Ajustar aqui

// Limiar de superávit/déficit (padrão: R$ 100)
if (estimatedSurplus > 100) { // <- Ajustar aqui
```

---

## Regras de Negócio

### Quando NÃO Mostrar Insights

1. **Sem Transações**
   - Se o usuário não tem nenhuma transação
   - Se não há transações de despesa

2. **Sem Histórico**
   - Se só tem transações do mês atual
   - Se não há dados de meses anteriores para comparação

3. **Dados Insuficientes**
   - Menos de 10 transações para projeção de fluxo de caixa
   - Gastos muito baixos (< R$ 100) para serem relevantes

4. **Variação Pequena**
   - Aumento de gastos < 30%
   - Superávit/déficit < R$ 100

### Priorização de Insights

1. **Gastos Anormais** (até 2 cards)
   - Ordenados por maior % de aumento
   - Categoria com maior impacto mostrada primeiro

2. **Projeção de Fluxo de Caixa** (1 card)
   - Apenas se houver dados suficientes
   - Mostra positivo ou negativo, nunca ambos

---

## Exemplos de Uso

### Cenário 1: Usuário Novo (Sem Histórico)
```typescript
Transações: 5 transações do mês atual
Resultado: Nenhum insight exibido
Motivo: Não há histórico para comparação
```

### Cenário 2: Gasto Anormal em Categoria
```typescript
Transações:
- Mês atual: R$ 2,000 em "Dining"
- Média anterior: R$ 1,200 em "Dining"

Resultado: Insight de UNUSUAL_SPENDING
Aumento: 67%
Descrição: "Your spending in this category is up 67% this month..."
```

### Cenário 3: Fluxo de Caixa Positivo
```typescript
Transações:
- Renda do mês: R$ 8,000
- Gastos até hoje: R$ 3,500 (15 dias)
- Projeção total: R$ 7,000
- Superávit estimado: R$ 1,000

Resultado: Insight de CASH_FLOW_FORECAST (positivo)
```

### Cenário 4: Múltiplos Insights
```typescript
Resultado:
1. "Higher than usual spending in Dining" (UNUSUAL_SPENDING)
2. "Higher than usual spending in Shopping" (UNUSUAL_SPENDING)
3. "Positive Cash Flow Forecast" (CASH_FLOW_FORECAST)

Total: 3 insights cards exibidos
```

---

## Performance e Otimização

### useMemo Hook
O hook `useFinancialInsights` usa `useMemo` para cachear os cálculos:

```typescript
export function useFinancialInsights(transactions: ApiTransaction[]): FinancialInsight[] {
  return useMemo(() => {
    // Cálculos pesados aqui
    // Só recalcula quando transactions mudar
  }, [transactions]);
}
```

**Benefícios:**
- ✅ Evita recalcular insights em cada re-render
- ✅ Melhora performance em listas grandes
- ✅ Só recalcula quando transações mudam

### Complexidade

**Tempo:** O(n) onde n = número de transações
- 1 passada para separar por período
- 1 passada para agrupar por categoria
- 1 passada para calcular médias

**Espaço:** O(c) onde c = número de categorias
- Armazena agregados por categoria

---

## Testes e Validação

### Checklist de Validação

- [ ] Insights aparecem com dados suficientes
- [ ] Nenhum insight aparece sem histórico
- [ ] Cálculos percentuais estão corretos
- [ ] Formatação de moeda em pt-BR
- [ ] Nomes de categorias formatados corretamente
- [ ] Projeção de fluxo de caixa realista
- [ ] Performance com 100+ transações
- [ ] Navegação para Transactions funciona

### Como Testar

1. **Criar transações de teste:**
   ```bash
   # Adicione transações via API ou interface
   # Categorias: Dining, Shopping, Transport, etc.
   # Valores variados para criar padrões
   ```

2. **Verificar insights:**
   - Navegue para Dashboard
   - Verifique seção "AI Insights"
   - Insights devem aparecer automaticamente

3. **Testar cenários:**
   - Usuário novo (sem transações)
   - Usuário com poucas transações
   - Usuário com muitas transações e padrões claros

---

## Futuras Melhorias

### Curto Prazo
- [ ] Insight de oportunidades de economia (assinaturas duplicadas)
- [ ] Comparação com média de outros usuários (anônimo)
- [ ] Sugestões de orçamento por categoria

### Médio Prazo
- [ ] Machine Learning para previsões mais precisas
- [ ] Detecção de sazonalidade (Natal, férias, etc.)
- [ ] Alertas proativos via notificações

### Longo Prazo
- [ ] Recomendações personalizadas de investimento
- [ ] Análise de crédito e score financeiro
- [ ] Integração com metas financeiras
- [ ] Gamificação de economia

---

## Troubleshooting

### Problema: Insights não aparecem
**Soluções:**
1. Verificar se há transações no banco
2. Confirmar que há histórico de meses anteriores
3. Checar console do browser para erros
4. Validar formato das transações da API

### Problema: Cálculos incorretos
**Soluções:**
1. Verificar timezone das datas
2. Confirmar que `amount` é sempre positivo na API
3. Validar tipos de transação (income/expense)
4. Checar se categorias estão sendo parseadas corretamente

### Problema: Performance lenta
**Soluções:**
1. Verificar se useMemo está funcionando
2. Considerar paginar transações antigas
3. Adicionar cache no backend
4. Limitar análise aos últimos 12 meses

---

## Arquivos Relacionados

```
apps/web/src/
├── hooks/
│   ├── useTransactions.ts          # Busca transações da API
│   └── useFinancialInsights.ts     # 🆕 Gera insights de IA
├── screens/
│   └── DashboardOverviewScreen.tsx # Exibe insights
├── types.ts                        # Interfaces TypeScript
└── constants.ts                    # MOCK_INSIGHTS removido
```

## Conclusão

O sistema de AI Insights oferece análise financeira em tempo real baseada em dados reais do usuário, sem depender de dados mockados. O sistema é:

- 🎯 **Preciso**: Baseado em dados reais
- ⚡ **Rápido**: Otimizado com useMemo
- 🧠 **Inteligente**: Detecta padrões automaticamente
- 🔒 **Privado**: Cálculos no cliente, sem enviar dados para servidor
- 📱 **Responsivo**: Funciona em todos os dispositivos

Se não houver dados suficientes, o sistema gracefully não exibe nada, mantendo a interface limpa e profissional.
