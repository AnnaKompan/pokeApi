import pokemonCardTpl from '../partials/markup';
import API from '../js/api-service';

const refs = {
  cardContainer: document.querySelector('.card-container'),
  searchForm: document.querySelector('.poke_form'),
};

const moreBtn = document.querySelector('.more_btn');
moreBtn.addEventListener('click', morePokemons);

document.addEventListener('DOMContentLoaded', loadAll);
refs.searchForm.addEventListener('submit', onSearch);

// function loadAll() {
//   API.fetchAll(20)
//     .then(data => {
//       return Promise.all(
//         data.results.map(p => fetch(p.url).then(res => res.json()))
//       );
//     })
//     .then(renderPokemonList)
//     .catch(console.error);
// }
function loadAll() {
  fetchBatch();
}
let limit = 20;
let offset = 0;
let totalCount = 0;
function fetchBatch() {
  API.fetchAll(limit, offset)
    .then(data => {
      totalCount = data.count;
      offset += limit;

      return Promise.all(
        data.results.map(p => fetch(p.url).then(res => res.json()))
      );
    })
    .then(renderPokemonList)
    .catch(err => console.error(err));
}

function renderPokemonList(pokemonArray) {
  pokemonArray.forEach(pokemonCardTpl);
}

function onSearch(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const searchQuery = form.elements.query.value.trim();

  API.fetchPokemon(searchQuery)
    .then(pokemonCardTpl)
    .catch(onFetchErr)
    .finally(() => form.reset());
}

function onFetchErr() {
  alert('алярм алярм!!!  USE NUMBERS!!!');
}

function morePokemons() {
  if (offset >= totalCount) {
    alert('No More Pokemons to load!');
    return;
  }
  fetchBatch();
}
