/**
 * Random Name CLI
 *
 * Script executável para gerar nomes aleatórios via CLI
 *
 * Uso:
 *   npx ts-node src/utils/random-name.cli.ts              # Uma palavra
 *   npx ts-node src/utils/random-name.cli.ts 3            # Três palavras
 *   npx ts-node src/utils/random-name.cli.ts 3 "-"        # Três palavras com "-"
 *   npx ts-node src/utils/random-name.cli.ts 3 "_" 10     # Gera 10 nomes
 */

import { generateRandomName, generateRandomNames } from './random-name.generator';

const args = process.argv.slice(2);

const wordCount = parseInt(args[0] || '3', 10);
const separator = args[1] || '_';
const nameCount = parseInt(args[2] || '1', 10);

// Validação
if (isNaN(wordCount) || wordCount < 1) {
  console.error('Erro: Número de palavras deve ser um inteiro positivo');
  console.log('Uso: ts-node random-name.cli.ts [word_count] [separator] [name_count]');
  console.log('Exemplo: ts-node random-name.cli.ts 3 "_" 5');
  process.exit(1);
}

// Gera e exibe os nomes
if (nameCount === 1) {
  console.log(generateRandomName(separator, wordCount));
} else {
  const names = generateRandomNames(nameCount, separator);
  names.forEach((name) => console.log(name));
}
