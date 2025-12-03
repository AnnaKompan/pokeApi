import API from './api-service';

// Mock the global fetch function
global.fetch = jest.fn();

describe('API.fetchPokemonImageUrl', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('should return an image URL for a valid pokemon', async () => {
        const mockPokeApiResponse = {
            sprites: {
                other: {
                    'official-artwork': {
                        front_default: 'http://example.com/ditto.png'
                    }
                }
            }
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockPokeApiResponse),
        });

        const imageUrl = await API.fetchPokemonImageUrl('ditto');

        expect(imageUrl).toBe('http://example.com/ditto.png');
        expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/ditto');
    });

    it('should throw an error for a non-existent Pokemon', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({}), // fetchPokemon in api-service doesn't throw on !ok
        });

        // This test needs to assert that the fetchPokemon call leads to an error
        // because sprites will be undefined.
        await expect(API.fetchPokemonImageUrl('nonexistentpokemon')).rejects.toThrow('Image not found for this Pokemon');
    });

    it('should throw an error if the pokemon exists but has no image', async () => {
        const mockPokeApiResponse = {
            sprites: {
                other: {
                    'official-artwork': {
                        front_default: null
                    }
                }
            }
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockPokeApiResponse),
        });

        await expect(API.fetchPokemonImageUrl('noimagepokemon')).rejects.toThrow('Image not found for this Pokemon');
    });
});
