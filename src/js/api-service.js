const BASE_URL = `https://pokeapi.co/api/v2`;

function fetchPokemon(pokemonId) {
  const url = `${BASE_URL}/pokemon/${pokemonId}`;
  return fetch(url).then(response => response.json());
}

async function fetchPokemonImageUrl(pokemonName) {
  const pokemonData = await fetchPokemon(pokemonName.toLowerCase());
  const imageUrl = pokemonData.sprites?.other?.['official-artwork']?.front_default;

  if (!imageUrl) {
    throw new Error('Image not found for this Pokemon');
  }

  return imageUrl;
}

export default { fetchPokemon, fetchPokemonImageUrl };