# @horizon-ai/bank-icons

Brazilian bank icons and utilities for Horizon AI.

## Features

- 🏦 **Comprehensive Bank Database**: Information about major Brazilian banks including ISPB codes, names, and brand colors
- 📅 **Holiday Calendar**: Check if a date is a business day, considering Brazilian national holidays
- 🎨 **Brand Colors**: Get official brand colors for each bank
- ⚡ **TypeScript Support**: Full TypeScript definitions included

## Installation

```bash
pnpm add @horizon-ai/bank-icons
```

## Usage

### Bank Information

```typescript
import { getBankByCode, getBankName, getBankColor, getAllBanks } from '@horizon-ai/bank-icons';

// Get full bank information
const bank = getBankByCode('001'); // Banco do Brasil
console.log(bank.name, bank.color);

// Get just the name
const name = getBankName('260'); // Nubank

// Get brand color
const color = getBankColor('341'); // #EC7000 (Itaú orange)

// List all banks
const allBanks = getAllBanks();
```

### Business Day Utilities

```typescript
import { isBusinessDay, isBrazilianHoliday, getNextBusinessDay, addBusinessDays } from '@horizon-ai/bank-icons';

// Check if a date is a business day
const today = new Date();
if (isBusinessDay(today)) {
  console.log('Today is a business day');
}

// Check if it's a Brazilian holiday
if (isBrazilianHoliday(today)) {
  console.log('Today is a holiday');
}

// Get next business day
const nextDay = getNextBusinessDay(today);

// Add business days
const futureDate = addBusinessDays(today, 5); // 5 business days from now
```

## Supported Banks

The package includes information for major Brazilian banks:

- Banco do Brasil (001)
- Santander (033)
- Caixa Econômica Federal (104)
- Bradesco (237)
- Itaú (341)
- Nubank (260)
- PagBank (290)
- Inter (077)
- C6 Bank (336)
- BTG Pactual (208)
- And many more...

## Brazilian Holidays

The package automatically handles:

- **Fixed holidays**: New Year, Tiradentes, Labor Day, Independence Day, etc.
- **Movable holidays**: Carnaval, Good Friday, Corpus Christi (calculated using the Meeus/Jones/Butcher algorithm)
- **Weekends**: Saturdays and Sundays

## License

MIT
