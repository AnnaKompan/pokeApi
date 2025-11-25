import pokemonCardTpl from '../partials/markup';
import API from '../js/api-service';
import {
  filterByName,
  sortByNameAZ,
  sortByNameZA,
  sortByIdAsc,
  sortByIdDesc,
  filterByType,
} from './filter_sort/filter_sort';

let allPokemons = [];
let limit = 20;
let offset = 0;
let totalCount = 0;

const refs = {
  cardContainer: document.querySelector('.card-container'),
  searchForm: document.querySelector('.poke_form'),
  sortSelect: document.querySelector('.poke_sort'),
  filterSelect: document.querySelector('.poke_filter'),
  searchInput: document.querySelector('.poke-input'),
  moreBtn: document.querySelector('.more_btn'),
};

// Event listeners
refs.moreBtn.addEventListener('click', morePokemons);
document.addEventListener('DOMContentLoaded', loadAll);
refs.searchInput.addEventListener('input', filterAndSort);
refs.searchForm.addEventListener('submit', onSearch);
refs.sortSelect.addEventListener('change', filterAndSort);
refs.filterSelect.addEventListener('change', filterAndSort);

function loadAll() {
  fetchBatch().then(() => {
    filterAndSort(); // render first batch
  });
}
// Fetch batch of Pokémon
function fetchBatch() {
  return API.fetchAll(limit, offset)
    .then(data => {
      totalCount = data.count;
      return Promise.all(
        data.results.map(p => fetch(p.url).then(res => res.json()))
      );
    })
    .then(pokemonArr => {
      offset += limit;
      allPokemons = [...allPokemons, ...pokemonArr]; // always append new batch
      return pokemonArr; // return only new batch
    })
    .catch(err => console.error(err));
}

// Render Pokémon list
function renderPokemonList(pokemonArray, append = false) {
  if (!append) refs.cardContainer.innerHTML = '';
  const markup = pokemonArray.map(p => pokemonCardTpl(p)).join('');
  refs.cardContainer.insertAdjacentHTML('beforeend', markup);
}

// Search submit
function onSearch(e) {
  e.preventDefault();
  filterAndSort();
}

// Filter + sort + type
function filterAndSort() {
  const query = refs.searchInput.value.trim().toLowerCase();
  let result = allPokemons;

  if (query) result = filterByName(result, query);

  const selectedType = refs.filterSelect.value;
  if (selectedType && selectedType !== 'all')
    result = filterByType(result, selectedType);

  const mode = refs.sortSelect.value;
  if (mode === 'asc') result = sortByNameAZ(result);
  if (mode === 'desc') result = sortByNameZA(result);
  if (mode === 'id-asc') result = sortByIdAsc(result);
  if (mode === 'id-desc') result = sortByIdDesc(result);

  renderPokemonList(result);
}

// Lazy load / load more
function morePokemons() {
  if (offset >= totalCount) {
    alert('No more Pokémons to load!');
    return;
  }

  fetchBatch().then(newBatch => {
    // append new batch to the DOM regardless of filtering
    renderPokemonList(newBatch, true);
  });
}
