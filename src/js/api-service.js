const BASE_URL = `https://pokeapi.co/api/v2`;

export default {
  fetchPokemon(nameID) {
    return fetch(`${BASE_URL}/pokemon/${nameID}`).then(response =>
      response.json()
    );
  },
  fetchAll(limit = 150) {
    return fetch(`${BASE_URL}/pokemon?limit=${limit}`).then(res => res.json());
  },
};
