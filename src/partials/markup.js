import {
  isFavorited,
  addToFavorites,
  removeFromFavorites,
  updateFavoriteCount,
} from '../js/favorites.js';

const refs = {
  cardContainer: document.querySelector('.card-container'),
};

// Store the current Pokemon data globally for favorites functionality
let currentPokemon = null;

export default function pokemonCardTpl(pokemon) {
  const { id, sprites, name, weight, height, abilities } = pokemon;
  const abilityName = abilities.map(ability => ability.ability.name).join(', ');

  // Store current Pokemon data for favorites
  currentPokemon = pokemon;
  window.currentPokemon = pokemon;

  // Check if already favorited
  const favorited = isFavorited(id);
  const buttonText = favorited ? '★ Favorited' : '☆ Add to Favorites';
  const buttonClass = favorited
    ? 'add-to-favorites-btn favorited'
    : 'add-to-favorites-btn';

  const card = `<div class='card' data-pokemon-id='${id}'>
<div class='card-img-top'>
  <img class='card-img-top-card' src='${sprites.front_default}' alt='${name}' />
</div>
<div class='card-body'>
  <h2 class='card-title'>Name: ${name}</h2>
  <p class='card-text'>Weight: ${weight}</p>
  <p class='card-text'>Height: ${height}</p>

  <h2 class='card-text'>Skills</h2>
    <ul class='list-group'>
      <li class='list-group-item'>${abilityName}</li>
    </ul>
    <p class='card-text'>
      <h2 class="poke-type-label">Type:</h2>
      ${pokemon.types
        .map(t => `<span class='pokemon-type'>${t.type.name}</span>`)
        .join(' ')}
    </p>
    <button class='${buttonClass}' data-pokemon-id='${id}'>${buttonText}</button>
</div>
</div>`;

  refs.cardContainer.innerHTML = '';
  refs.cardContainer.insertAdjacentHTML('beforeend', card);

  // Add event listener for the favorites button
  const favBtn = refs.cardContainer.querySelector('.add-to-favorites-btn');
  if (favBtn) {
    favBtn.addEventListener('click', handleFavoriteClick);
  }
}

function handleFavoriteClick(e) {
  const btn = e.target;
  const pokemonId = parseInt(btn.dataset.pokemonId);

  if (isFavorited(pokemonId)) {
    removeFromFavorites(pokemonId);
    btn.textContent = '☆ Add to Favorites';
    btn.classList.remove('favorited');
  } else {
    if (currentPokemon && currentPokemon.id === pokemonId) {
      addToFavorites(currentPokemon);
      btn.textContent = '★ Favorited';
      btn.classList.add('favorited');
    }
  }
  updateFavoriteCount();
}
