import { parseAIResult } from '../../src/js/openai';

describe('openai.js - parseAIResult', () => {
    test('should parse valid input correctly', () => {
        const input = `
Pikachu: Electric mouse
Charizard: Fire dragon
`;
        const result = parseAIResult(input);
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ name: 'Pikachu', reason: 'Electric mouse' });
        expect(result[1]).toEqual({ name: 'Charizard', reason: 'Fire dragon' });
    });

    test('should handle empty input', () => {
        expect(parseAIResult('')).toEqual([]);
        expect(parseAIResult(null)).toEqual([]);
        expect(parseAIResult(undefined)).toEqual([]);
    });

    test('should ignore lines without colons', () => {
        const input = `
Valid: Line
Invalid Line
Another: Valid
`;
        const result = parseAIResult(input);
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Valid');
        expect(result[1].name).toBe('Another');
    });

    test('should trim whitespace', () => {
        const input = '  Mew  :   Psychic cat  ';
        const result = parseAIResult(input);
        expect(result[0]).toEqual({ name: 'Mew', reason: 'Psychic cat' });
    });

    test('should handle multiple colons in reason', () => {
        const input = 'Note: This: reason: has: colons';
        const result = parseAIResult(input);
        expect(result[0]).toEqual({ name: 'Note', reason: 'This: reason: has: colons' });
    });
});
