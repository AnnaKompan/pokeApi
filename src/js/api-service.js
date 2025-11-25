const BASE_URL = `https://pokeapi.co/api/v2`;

export default {
  fetchPokemon(nameID) {
    return fetch(`${BASE_URL}/pokemon/${nameID}`).then(res => {
      if (!res.ok) throw new Error('Pokemon not found');
      return res.json();
    });
  },

  fetchAll(limit = 20, offset = 0) {
    return fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`).then(
      res => {
        if (!res.ok) throw new Error('Failed to fetch Pokémon');
        return res.json();
      }
    );
  },
};
