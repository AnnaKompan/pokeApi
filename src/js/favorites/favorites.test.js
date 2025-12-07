/**
 * Unit Tests for Favorites Module
 * Tests core localStorage functions without DOM dependencies
 */

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Mock document for DOM-dependent functions
const documentMock = {
  querySelector: jest.fn(() => null),
  querySelectorAll: jest.fn(() => []),
  getElementById: jest.fn(() => null),
};

// Setup global mocks before importing module
global.localStorage = localStorageMock;
global.document = documentMock;
global.window = { 
  addToFavorites: null, 
  removeFromFavorites: null,
  getFavorites: null,
  isFavorited: null,
  updateFavoritesUI: null,
  updateFavoriteCount: null,
};

// Import functions to test
const {
  getFavorites,
  isFavorited,
  addToFavorites,
  removeFromFavorites,
} = require('./favorites.js');

const STORAGE_KEY = 'pokemonFavorites';

// Sample test data
const mockPikachu = {
  id: 25,
  name: 'pikachu',
  sprites: { front_default: 'https://example.com/pikachu.png' },
  weight: 60,
  height: 4,
  abilities: [{ ability: { name: 'static' } }],
  types: [{ type: { name: 'electric' } }],
};

const mockBulbasaur = {
  id: 1,
  name: 'bulbasaur',
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
  weight: 69,
  height: 7,
  abilities: [{ ability: { name: 'overgrow' } }],
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
};

const mockCharmander = {
  id: 4,
  name: 'charmander',
  sprites: { front_default: 'https://example.com/charmander.png' },
  weight: 85,
  height: 6,
  abilities: [{ ability: { name: 'blaze' } }],
  types: [{ type: { name: 'fire' } }],
};

describe('Favorites Module - Unit Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('getFavorites()', () => {
    test('should return empty array when no favorites exist', () => {
      const favorites = getFavorites();
      expect(favorites).toEqual([]);
    });

    test('should return parsed favorites from localStorage', () => {
      const storedFavorites = [mockPikachu, mockBulbasaur];
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify(storedFavorites));

      const favorites = getFavorites();
      expect(favorites).toEqual(storedFavorites);
    });

    test('should throw error for invalid JSON (data corruption)', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid json');
      
      // Invalid JSON in localStorage indicates data corruption - should throw
      expect(() => getFavorites()).toThrow(SyntaxError);
    });
  });

  describe('isFavorited()', () => {
    test('should return false when Pokemon is not in favorites', () => {
      const result = isFavorited(25);
      expect(result).toBe(false);
    });

    test('should return true when Pokemon is in favorites', () => {
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify([mockPikachu]));

      const result = isFavorited(25);
      expect(result).toBe(true);
    });

    test('should return false for different Pokemon ID', () => {
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify([mockPikachu]));

      const result = isFavorited(1); // Bulbasaur ID
      expect(result).toBe(false);
    });

    test('should handle multiple favorites correctly', () => {
      localStorageMock.setItem(
        STORAGE_KEY,
        JSON.stringify([mockPikachu, mockBulbasaur, mockCharmander])
      );

      expect(isFavorited(25)).toBe(true);  // Pikachu
      expect(isFavorited(1)).toBe(true);   // Bulbasaur
      expect(isFavorited(4)).toBe(true);   // Charmander
      expect(isFavorited(7)).toBe(false);  // Squirtle (not added)
    });
  });

  describe('addToFavorites()', () => {
    test('should add Pokemon to empty favorites', () => {
      addToFavorites(mockPikachu);

      // Check localStorage was called with correct data
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.any(String)
      );

      // Verify the stored data
      const storedData = JSON.parse(
        localStorageMock.setItem.mock.calls[0][1]
      );
      expect(storedData.length).toBe(1);
      expect(storedData[0].id).toBe(25);
      expect(storedData[0].name).toBe('pikachu');
    });

    test('should add Pokemon to existing favorites', () => {
      // First add Pikachu
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify([mockPikachu]));

      // Then add Bulbasaur
      addToFavorites(mockBulbasaur);

      const storedData = JSON.parse(
        localStorageMock.setItem.mock.calls[
          localStorageMock.setItem.mock.calls.length - 1
        ][1]
      );
      expect(storedData.length).toBe(2);
    });

    test('should NOT add duplicate Pokemon', () => {
      // Add Pikachu first
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify([mockPikachu]));

      // Try to add Pikachu again
      addToFavorites(mockPikachu);

      // Should not have added a duplicate - setItem should not be called again
      // (after the initial setup)
      const favorites = getFavorites();
      expect(favorites.length).toBe(1);
    });

    test('should store required Pokemon properties', () => {
      addToFavorites(mockPikachu);

      const storedData = JSON.parse(
        localStorageMock.setItem.mock.calls[0][1]
      );
      const savedPokemon = storedData[0];

      expect(savedPokemon).toHaveProperty('id');
      expect(savedPokemon).toHaveProperty('name');
      expect(savedPokemon).toHaveProperty('sprites');
      expect(savedPokemon).toHaveProperty('weight');
      expect(savedPokemon).toHaveProperty('height');
      expect(savedPokemon).toHaveProperty('abilities');
      expect(savedPokemon).toHaveProperty('types');
    });
  });

  describe('removeFromFavorites()', () => {
    test('should remove Pokemon from favorites by ID', () => {
      // Setup: Add multiple Pokemon
      localStorageMock.setItem(
        STORAGE_KEY,
        JSON.stringify([mockPikachu, mockBulbasaur, mockCharmander])
      );

      // Remove Bulbasaur
      removeFromFavorites(1);

      const storedData = JSON.parse(
        localStorageMock.setItem.mock.calls[
          localStorageMock.setItem.mock.calls.length - 1
        ][1]
      );

      expect(storedData.length).toBe(2);
      expect(storedData.find(p => p.id === 1)).toBeUndefined();
      expect(storedData.find(p => p.id === 25)).toBeDefined();
      expect(storedData.find(p => p.id === 4)).toBeDefined();
    });

    test('should handle removing non-existent Pokemon gracefully', () => {
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify([mockPikachu]));

      // Try to remove Pokemon that doesn't exist
      removeFromFavorites(999);

      const storedData = JSON.parse(
        localStorageMock.setItem.mock.calls[
          localStorageMock.setItem.mock.calls.length - 1
        ][1]
      );

      // Original Pokemon should still be there
      expect(storedData.length).toBe(1);
      expect(storedData[0].id).toBe(25);
    });

    test('should result in empty array when removing last Pokemon', () => {
      localStorageMock.setItem(STORAGE_KEY, JSON.stringify([mockPikachu]));

      removeFromFavorites(25);

      const storedData = JSON.parse(
        localStorageMock.setItem.mock.calls[
          localStorageMock.setItem.mock.calls.length - 1
        ][1]
      );

      expect(storedData).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty Pokemon object gracefully', () => {
      const emptyPokemon = { id: 100, name: 'missingno' };
      addToFavorites(emptyPokemon);

      const storedData = JSON.parse(
        localStorageMock.setItem.mock.calls[0][1]
      );
      expect(storedData[0].id).toBe(100);
      expect(storedData[0].name).toBe('missingno');
    });

    test('should handle Pokemon with ID 0', () => {
      const zeroPokemon = { id: 0, name: 'zero' };
      addToFavorites(zeroPokemon);

      expect(isFavorited(0)).toBe(true);
    });

    test('should distinguish between similar IDs', () => {
      localStorageMock.setItem(
        STORAGE_KEY,
        JSON.stringify([{ id: 1, name: 'bulbasaur' }])
      );

      expect(isFavorited(1)).toBe(true);
      expect(isFavorited(10)).toBe(false);
      expect(isFavorited(11)).toBe(false);
      expect(isFavorited(100)).toBe(false);
    });
  });
});
