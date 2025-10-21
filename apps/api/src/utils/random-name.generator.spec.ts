import { generateRandomName, generateRandomNames, generateUniqueRandomName } from './random-name.generator';

describe('RandomNameGenerator', () => {
  describe('generateRandomName', () => {
    it('should generate a name with default separator (_)', () => {
      const name = generateRandomName();
      expect(name).toMatch(/^\w+_\w+_\w+$/);
    });

    it('should generate a name with custom separator', () => {
      const name = generateRandomName('-');
      expect(name).toMatch(/^\w+-\w+-\w+$/);
    });

    it('should generate a name with custom word count', () => {
      const name = generateRandomName('_', 5);
      const parts = name.split('_');
      expect(parts).toHaveLength(5);
    });

    it('should generate a name with single word', () => {
      const name = generateRandomName('_', 1);
      expect(name).not.toContain('_');
    });

    it('should generate names with various separators', () => {
      const separators = ['-', ':', '.', '|', '@'];
      separators.forEach((sep) => {
        const name = generateRandomName(sep);
        expect(name).toContain(sep);
      });
    });

    it('should generate different names on consecutive calls', () => {
      const name1 = generateRandomName();
      const name2 = generateRandomName();
      // Probabilidade extremamente alta de serem diferentes
      expect(name1).not.toBe(name2);
    });
  });

  describe('generateRandomNames', () => {
    it('should generate multiple names', () => {
      const names = generateRandomNames(5);
      expect(names).toHaveLength(5);
      expect(names.every((n) => typeof n === 'string')).toBe(true);
    });

    it('should generate names with custom separator', () => {
      const names = generateRandomNames(3, '-');
      expect(names.every((n) => n.includes('-'))).toBe(true);
    });

    it('should generate zero names when count is 0', () => {
      const names = generateRandomNames(0);
      expect(names).toHaveLength(0);
    });

    it('should generate large batches of names', () => {
      const names = generateRandomNames(100);
      expect(names).toHaveLength(100);
    });
  });

  describe('generateUniqueRandomName', () => {
    it('should generate a unique name not in the set', () => {
      const existingNames = new Set(['alpha_bola_nove', 'delta_tigre_tres']);
      const newName = generateUniqueRandomName(existingNames);
      expect(newName).not.toBeNull();
      expect(existingNames.has(newName!)).toBe(false);
    });

    it('should return null when max attempts exceeded', () => {
      const existingNames = new Set<string>();
      // Adiciona muitos nomes para fazer falhar (na prática isso é improvável)
      // Este teste é mais para validar o comportamento máximo
      const newName = generateUniqueRandomName(existingNames, 1000);
      expect(newName).toBeNull();
    });

    it('should respect the maxAttempts parameter', () => {
      const existingNames = new Set(['alpha_bola_nove']);
      const newName = generateUniqueRandomName(existingNames, 1);
      // Pode ser null ou um nome único
      if (newName !== null) {
        expect(existingNames.has(newName)).toBe(false);
      }
    });

    it('should generate unique names for multiple calls', () => {
      const existingNames = new Set<string>();
      const count = 10;
      const names: string[] = [];

      for (let i = 0; i < count; i++) {
        const name = generateUniqueRandomName(existingNames);
        if (name) {
          names.push(name);
          existingNames.add(name);
        }
      }

      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length); // Todos devem ser únicos
    });
  });

  describe('Integration tests', () => {
    it('should generate names suitable for identifiers', () => {
      const name = generateRandomName();
      expect(/^[a-z_]+$/.test(name)).toBe(true); // Válido para variáveis JS
    });

    it('should work with different configurations', () => {
      const configs = [
        { words: 1, sep: '_' },
        { words: 2, sep: '-' },
        { words: 3, sep: '_' },
        { words: 4, sep: ':' },
        { words: 5, sep: '.' },
      ];

      configs.forEach(({ words, sep }) => {
        const name = generateRandomName(sep, words);
        const parts = name.split(sep);
        expect(parts).toHaveLength(words);
      });
    });

    it('should generate names efficiently', () => {
      const start = Date.now();
      generateRandomNames(1000);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // Deve ser rápido
    });
  });
});
