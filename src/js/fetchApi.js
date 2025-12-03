import pokemonCardTpl from '../partials/markup';
import API from '../js/api-service';
import { initFavorites, hideFavoritesSection } from '../js/favorites.js';

const refs = {
  cardContainer: document.querySelector('.card-container'),
  searchForm: document.querySelector('.poke_form'),
};

// Initialize favorites functionality on page load
document.addEventListener('DOMContentLoaded', () => {
  initFavorites();
});

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  
  // Hide favorites section when searching
  hideFavoritesSection();

  const form = e.currentTarget;
  console.log(form.elements);
  const searchQuery = form.elements.query.value.trim();
  console.log(searchQuery);

  API.fetchPokemon(searchQuery)
    .then(pokemonCardTpl)
    .catch(onFetchErr)
    .finally(() => form.reset());
}

function onFetchErr() {
  alert('алярм алярм!!!  USE NUMBERS!!!');
}
