# Types and Constants

This directory contains all TypeScript type definitions and constants for the Horizon AI application.

## Files

### `index.ts`

Contains all TypeScript interfaces and type definitions, organized by domain:

- **Core Entity Types**: User, UserProfile, UserPreferences, UserSettings
- **Account Types**: Account, AccountData, AccountType, AccountStatus
- **Credit Card Types**: CreditCard, CreditCardData, CreditCardBrand
- **Transaction Types**: Transaction, TransactionData, TransactionType, TransactionStatus
- **Category Types**: Category
- **Bank Types**: Bank
- **Invoice Types**: Invoice, InvoiceStatus
- **Notification Types**: Notification
- **Warranty Types**: Warranty
- **Tax Types**: TaxSection, TaxAsset, TaxIncome
- **Financial Planning Types**: FinancialGoal, SuggestedGoal, RetirementGoal
- **Insurance Types**: InsurancePolicy
- **Succession Planning Types**: Beneficiary
- **Integration Types**: Integration
- **Family Management Types**: FamilyMember
- **AI Insights Types**: FinancialInsight
- **Shopping List Types**: ShoppingList, ShoppingListItem, PurchasedItem, PurchaseRecord
- **Chart Data Types**: MonthlyChartData
- **API Types**: APIError, PaginatedResponse, APIResponse
- **DTO Types**: CreateAccountDto, UpdateAccountDto, CreateCreditCardDto, etc.
- **UI Types**: UserRole, ToastType, Toast, Screen, CategoryIcon

## Usage

Import types in your components and services:

```typescript
import type { Account, CreateAccountDto, Transaction, User } from '@/lib/types';
```

## Migration Notes

- All types from `apps/web/src/types.ts` have been migrated
- All DTOs from `apps/api/src/database/dto/` have been included
- Types from `apps/api/src/database/appwrite-schema.ts` have been consolidated
- Icon types are currently using `FC<{ className?: string }>` - these will be updated when components are migrated
- The `Screen` type is kept for migration reference but will be deprecated once routing is complete

## Next Steps

When migrating components:

1. Update icon imports in `lib/constants.ts` once icon components are migrated
2. Update logo imports in `lib/constants.ts` once bank logo components are migrated
3. Consider splitting types into domain-specific files if the file becomes too large
