/**
 * Random Name Generator
 *
 * Gera nomes aleatórios no formato: "palavra1_palavra2_palavra3"
 * Exemplo: alpha_bola_nove, delta_zebra_sete, etc
 *
 * Uso:
 * import { generateRandomName } from '@/lib/utils/random-name.generator';
 * const name = generateRandomName(); // "alpha_bola_nove"
 */

const ADJECTIVES = [
  'alpha',
  'beta',
  'gamma',
  'delta',
  'epsilon',
  'zeta',
  'eta',
  'theta',
  'iota',
  'kappa',
  'lambda',
  'mu',
  'nu',
  'xi',
  'omicron',
  'pi',
  'rho',
  'sigma',
  'tau',
  'upsilon',
  'phi',
  'chi',
  'psi',
  'omega',
  'veloz',
  'rapido',
  'lento',
  'forte',
  'suave',
  'agil',
  'astuto',
  'sabio',
  'bravo',
  'corajoso',
  'nobre',
  'alto',
  'baixo',
  'largo',
  'estreito',
  'quente',
  'frio',
  'claro',
  'escuro',
  'brilhante',
  'fosco',
  'doce',
  'amargo',
  'suculento',
  'seco',
];

const NOUNS = [
  'aguia',
  'abelha',
  'leao',
  'tigre',
  'lobo',
  'raposa',
  'urso',
  'coelho',
  'pato',
  'ganso',
  'coruja',
  'peregrino',
  'falcao',
  'gavioo',
  'cigarra',
  'sapo',
  'tartaruga',
  'cobra',
  'dragao',
  'fenix',
  'foca',
  'golfinho',
  'baleia',
  'tubarao',
  'aranha',
  'escorpiao',
  'lagosta',
  'caranguejo',
  'bola',
  'bolo',
  'cama',
  'cadeira',
  'mesa',
  'livro',
  'caneta',
  'lapis',
  'fogo',
  'agua',
  'ar',
  'terra',
  'pedra',
  'areia',
  'neve',
  'chuva',
  'vento',
  'nuvem',
  'sol',
  'lua',
  'estrela',
  'coracao',
  'mente',
  'alma',
  'corpo',
  'mao',
  'pe',
  'cabeca',
  'olho',
  'ouvido',
  'boca',
  'nariz',
  'dente',
  'cabelo',
];

const NUMBERS = [
  'zero',
  'um',
  'dois',
  'tres',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
  'dez',
  'onze',
  'doze',
  'treze',
  'quatorze',
  'quinze',
  'dezesseis',
  'dezessete',
  'dezoito',
  'dezenove',
  'vinte',
  'trinta',
  'quarenta',
  'cinquenta',
  'sessenta',
  'setenta',
  'oitenta',
  'noventa',
  'cem',
];

/**
 * Seleciona um elemento aleatório de um array
 */
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Gera um nome aleatório no formato "palavra1_palavra2_palavra3"
 *
 * @param separator - Separador entre palavras (padrão: "_")
 * @param wordCount - Número de palavras (padrão: 3)
 * @returns Nome aleatório formatado
 *
 * @example
 * generateRandomName() // "alpha_bola_nove"
 * generateRandomName("-", 2) // "delta-tigre"
 * generateRandomName("_", 4) // "epsilon_aguia_cinco_bravo"
 */
export function generateRandomName(separator: string = '_', wordCount: number = 3): string {
  const words: string[] = [];

  for (let i = 0; i < wordCount; i++) {
    const pool = i % 3 === 0 ? ADJECTIVES : i % 3 === 1 ? NOUNS : NUMBERS;
    words.push(getRandomElement(pool));
  }

  return words.join(separator);
}

/**
 * Gera múltiplos nomes aleatórios
 *
 * @param count - Quantos nomes gerar
 * @param separator - Separador entre palavras
 * @returns Array de nomes aleatórios
 *
 * @example
 * generateRandomNames(5) // ["alpha_bola_nove", "delta_tigre_tres", ...]
 */
export function generateRandomNames(count: number, separator: string = '_'): string[] {
  return Array.from({ length: count }, () => generateRandomName(separator));
}

/**
 * Gera um nome aleatório garantindo unicidade em um conjunto
 *
 * @param existingNames - Conjunto de nomes já existentes
 * @param maxAttempts - Máximo de tentativas para gerar um nome único
 * @returns Nome aleatório único ou null se não conseguir após maxAttempts
 *
 * @example
 * const names = new Set(['alpha_bola_nove', 'delta_tigre_tres']);
 * const uniqueName = generateUniqueRandomName(names); // "epsilon_aguia_cinco"
 */
export function generateUniqueRandomName(existingNames: Set<string>, maxAttempts: number = 100): string | null {
  for (let i = 0; i < maxAttempts; i++) {
    const name = generateRandomName();
    if (!existingNames.has(name)) {
      return name;
    }
  }
  return null;
}
