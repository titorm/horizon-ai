export interface BankInfo {
  code: string; // ISPB Code
  name: string;
  shortName: string;
  color: string;
}

export const BRAZILIAN_BANKS: Record<string, BankInfo> = {
  '001': {
    code: '001',
    name: 'Banco do Brasil S.A.',
    shortName: 'Banco do Brasil',
    color: '#FFF200',
  },
  '033': {
    code: '033',
    name: 'Banco Santander (Brasil) S.A.',
    shortName: 'Santander',
    color: '#EC0000',
  },
  '104': {
    code: '104',
    name: 'Caixa Econômica Federal',
    shortName: 'Caixa',
    color: '#0066A1',
  },
  '237': {
    code: '237',
    name: 'Banco Bradesco S.A.',
    shortName: 'Bradesco',
    color: '#CC092F',
  },
  '341': {
    code: '341',
    name: 'Itaú Unibanco S.A.',
    shortName: 'Itaú',
    color: '#EC7000',
  },
  '260': {
    code: '260',
    name: 'Nu Pagamentos S.A. (Nubank)',
    shortName: 'Nubank',
    color: '#820AD1',
  },
  '290': {
    code: '290',
    name: 'Pagseguro Internet S.A.',
    shortName: 'PagBank',
    color: '#00A868',
  },
  '077': {
    code: '077',
    name: 'Banco Inter S.A.',
    shortName: 'Inter',
    color: '#FF7A00',
  },
  '212': {
    code: '212',
    name: 'Banco Original S.A.',
    shortName: 'Original',
    color: '#7ED957',
  },
  '756': {
    code: '756',
    name: 'Banco Cooperativo Sicoob S.A.',
    shortName: 'Sicoob',
    color: '#03A64A',
  },
  '748': {
    code: '748',
    name: 'Banco Cooperativo Sicredi S.A.',
    shortName: 'Sicredi',
    color: '#68C044',
  },
  '422': {
    code: '422',
    name: 'Banco Safra S.A.',
    shortName: 'Safra',
    color: '#0057A6',
  },
  '074': {
    code: '074',
    name: 'Banco J. Safra S.A.',
    shortName: 'J. Safra',
    color: '#003D7A',
  },
  '208': {
    code: '208',
    name: 'Banco BTG Pactual S.A.',
    shortName: 'BTG Pactual',
    color: '#000000',
  },
  '246': {
    code: '246',
    name: 'Banco ABC Brasil S.A.',
    shortName: 'ABC Brasil',
    color: '#003DA5',
  },
  '318': {
    code: '318',
    name: 'Banco BMG S.A.',
    shortName: 'BMG',
    color: '#FF6600',
  },
  '623': {
    code: '623',
    name: 'Banco PAN S.A.',
    shortName: 'Banco PAN',
    color: '#00A859',
  },
  '389': {
    code: '389',
    name: 'Banco Mercantil do Brasil S.A.',
    shortName: 'Mercantil',
    color: '#004A93',
  },
  '070': {
    code: '070',
    name: 'Banco de Brasília S.A.',
    shortName: 'BRB',
    color: '#004098',
  },
  '743': {
    code: '743',
    name: 'Banco Semear S.A.',
    shortName: 'Semear',
    color: '#008C45',
  },
  '380': {
    code: '380',
    name: 'PicPay Serviços S.A.',
    shortName: 'PicPay',
    color: '#21C25E',
  },
  '323': {
    code: '323',
    name: 'Mercado Pago',
    shortName: 'Mercado Pago',
    color: '#00AEEF',
  },
  '102': {
    code: '102',
    name: 'XP Investimentos',
    shortName: 'XP',
    color: '#000000',
  },
  '197': {
    code: '197',
    name: 'Stone Pagamentos S.A.',
    shortName: 'Stone',
    color: '#00AB4E',
  },
  '336': {
    code: '336',
    name: 'Banco C6 S.A.',
    shortName: 'C6 Bank',
    color: '#000000',
  },
  '655': {
    code: '655',
    name: 'Banco Votorantim S.A.',
    shortName: 'Votorantim',
    color: '#F26522',
  },
  '403': {
    code: '403',
    name: 'Banco Cora',
    shortName: 'Cora',
    color: '#FE3E6D',
  },
  '332': {
    code: '332',
    name: 'Acesso Soluções de Pagamento S.A.',
    shortName: 'Acesso',
    color: '#1E88E5',
  },
};

export function getBankByCode(code: string): BankInfo | undefined {
  return BRAZILIAN_BANKS[code];
}

export function getBankName(code: string): string {
  const bank = getBankByCode(code);
  return bank ? bank.shortName : 'Banco Desconhecido';
}

export function getBankColor(code: string): string {
  const bank = getBankByCode(code);
  return bank ? bank.color : '#6B7280';
}

export function getAllBanks(): BankInfo[] {
  return Object.values(BRAZILIAN_BANKS);
}

// Holiday checking functionality
export function isBusinessDay(date: Date): boolean {
  // Check if it's weekend
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  
  // Check if it's a Brazilian national holiday
  return !isBrazilianHoliday(date);
}

export function isBrazilianHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const day = date.getDate();
  
  // Fixed national holidays
  const fixedHolidays = [
    { month: 1, day: 1 },   // Ano Novo
    { month: 4, day: 21 },  // Tiradentes
    { month: 5, day: 1 },   // Dia do Trabalho
    { month: 9, day: 7 },   // Independência do Brasil
    { month: 10, day: 12 }, // Nossa Senhora Aparecida
    { month: 11, day: 2 },  // Finados
    { month: 11, day: 15 }, // Proclamação da República
    { month: 12, day: 25 }, // Natal
  ];
  
  for (const holiday of fixedHolidays) {
    if (month === holiday.month && day === holiday.day) {
      return true;
    }
  }
  
  // Movable holidays (Carnaval, Sexta-feira Santa, Corpus Christi)
  const easterDate = calculateEaster(year);
  const carnaval = new Date(easterDate);
  carnaval.setDate(easterDate.getDate() - 47); // 47 days before Easter
  
  const goodFriday = new Date(easterDate);
  goodFriday.setDate(easterDate.getDate() - 2);
  
  const corpusChristi = new Date(easterDate);
  corpusChristi.setDate(easterDate.getDate() + 60);
  
  const currentDate = new Date(year, month - 1, day);
  
  if (isSameDay(currentDate, carnaval) || 
      isSameDay(currentDate, goodFriday) || 
      isSameDay(currentDate, corpusChristi)) {
    return true;
  }
  
  return false;
}

function calculateEaster(year: number): Date {
  // Meeus/Jones/Butcher algorithm for calculating Easter
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

export function getNextBusinessDay(date: Date): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (!isBusinessDay(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
}

export function addBusinessDays(date: Date, days: number): Date {
  let result = new Date(date);
  let daysAdded = 0;
  
  while (daysAdded < days) {
    result = getNextBusinessDay(result);
    daysAdded++;
  }
  
  return result;
}
