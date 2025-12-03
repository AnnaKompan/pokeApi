import pokemonCardTpl from '../partials/markup';
import API from './api-service';

const refs = {
  cardContainer: document.querySelector('.card-container'),
  searchForm: document.querySelector('.poke_form'),
};

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const searchQuery = form.elements.query.value.trim();

  API.fetchPokemon(searchQuery)
    .then(renderPokemonCard)
    .catch(onFetchErr)
    .finally(() => form.reset());
}

function renderPokemonCard(pokemon) {
  const markup = pokemonCardTpl(pokemon);
  refs.cardContainer.innerHTML = markup;
}

function onFetchErr() {
  alert('алярм алярм!!!  USE NUMBERS!!!');
}
