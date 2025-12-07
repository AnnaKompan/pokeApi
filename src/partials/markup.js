import {
  isFavorited,
  addToFavorites,
  removeFromFavorites,
  updateFavoriteCount,
} from '../js/favorites/favorites.js';

const refs = {
  cardContainer: document.querySelector('.card-container'),
};

// Store the current Pokemon data globally for favorites functionality
let currentPokemon = null;

export default function pokemonCardTpl(pokemon) {
  const { id, sprites, name, weight, height, abilities, types } = pokemon;
  const abilityName = abilities.map(ab => ab.ability.name).join(', ');

  const favorited = isFavorited(id);
  const buttonText = favorited ? '★ Favorited' : '☆ Add to Favorites';
  const buttonClass = favorited
    ? 'add-to-favorites-btn favorited'
    : 'add-to-favorites-btn';

  return `
    <div class='card' data-pokemon-id='${id}'>
      <div class='card-img-top'>
        <img class='card-img-top-card' src='${
          sprites.front_default
        }' alt='${name}' />
      </div>
      <div class='card-body'>
        <h2 class='card-title'>Name: ${name}</h2>
        <p class='card-text'>Weight: ${weight}</p>
        <p class='card-text'>Height: ${height}</p>

        <h2 class='card-text'>Skills</h2>
        <ul class='list-group'>
          <li class='list-group-item'>${abilityName}</li>
        </ul>

        <h2 class='poke-type-label'>Type:</h2>
        <p class='card-text'>
          ${types
            .map(t => `<span class='pokemon-type'>${t.type.name}</span>`)
            .join(' ')}
        </p>

        <button 
          class='${buttonClass}' 
          data-pokemon-id='${id}' 
          data-pokemon='${JSON.stringify(pokemon).replace(/'/g, '&apos;')}'
        >
          ${buttonText}
        </button>
      </div>
    </div>
  `;
}
export function handleFavoriteClick(e) {
  const btn = e.target;
  const pokemonId = parseInt(btn.dataset.pokemonId);
  const pokemon = JSON.parse(btn.dataset.pokemon);

  if (isFavorited(pokemonId)) {
    removeFromFavorites(pokemonId);
    btn.textContent = '☆ Add to Favorites';
    btn.classList.remove('favorited');
  } else {
    addToFavorites(pokemon);
    btn.textContent = '★ Favorited';
    btn.classList.add('favorited');
  }

  updateFavoriteCount();
}
