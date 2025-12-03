// import pokemonCardTpl from '../partials/markup';
import pokemonCardTpl, { handleFavoriteClick } from '../partials/markup.js';
import API from '../js/api-service';
import { initFavorites, hideFavoritesSection } from '../js/favorites.js';
import {
  filterByName,
  sortByNameAZ,
  sortByNameZA,
  sortByIdAsc,
  sortByIdDesc,
  filterByType,
  filterByWeight,
  filterByHeight,
} from './filter_sort/filter_sort';

const refs = {
  cardContainer: document.querySelector('.card-container'),
  searchForm: document.querySelector('.poke_form'),
  sortSelect: document.querySelector('.poke_sort'),
  typeFilter: document.querySelector('.poke_filter'),
  searchInput: document.querySelector('.poke-input'),
  moreBtn: document.querySelector('.more_btn'),
  weightRange: document.querySelector('.poke_weights_range'),
  heightRange: document.querySelector('.poke_heights_range'),
  weightVal: document.getElementById('weight-value'),
  heightVal: document.getElementById('height-value'),
};

let allPokemons = [];
let limit = 20;
let offset = 0;
let totalCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  initFavorites();

  refs.moreBtn.addEventListener('click', morePokemons);
  refs.searchInput.addEventListener('input', () => {
    filterAndSort();
    refreshIfFavoritesPage();
  });
  refs.searchForm.addEventListener('submit', onSearch);
  refs.sortSelect.addEventListener('change', () => {
    filterAndSort();
    refreshIfFavoritesPage();
  });
  refs.typeFilter.addEventListener('change', () => {
    filterAndSort();
    refreshIfFavoritesPage();
  });

  refs.weightRange.addEventListener('input', () => {
    refs.weightVal.textContent = refs.weightRange.value;
    filterAndSort();
    refreshIfFavoritesPage();
  });

  refs.heightRange.addEventListener('input', () => {
    refs.heightVal.textContent = refs.heightRange.value;
    filterAndSort();
    refreshIfFavoritesPage();
  });

  loadAll();
});

// Initialize favorites functionality on page load
document.addEventListener('DOMContentLoaded', () => {
  initFavorites();
});

refs.searchForm.addEventListener('submit', onSearch);

function loadAll() {
  fetchBatch().then(() => {
    filterAndSort();
  });
}

function refreshIfFavoritesPage() {
  const favSection = document.querySelector('.favorites-section');
  if (favSection && favSection.style.display === 'block') {
    updateFavoritesUI();
  }
}

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
      allPokemons = [...allPokemons, ...pokemonArr];
      return pokemonArr;
    })
    .catch(err => console.error(err));
}

function renderPokemonList(pokemonArray, append = false) {
  if (!append) refs.cardContainer.innerHTML = '';

  const markup = pokemonArray.map(p => pokemonCardTpl(p)).join('');
  refs.cardContainer.insertAdjacentHTML('beforeend', markup);

  refs.cardContainer
    .querySelectorAll('.add-to-favorites-btn')
    .forEach(btn => btn.addEventListener('click', handleFavoriteClick));
}

function onSearch(e) {
  e.preventDefault();
  filterAndSort();
  // Hide favorites section when searching
  hideFavoritesSection();
}

function filterAndSort() {
  const query = refs.searchInput.value.trim().toLowerCase();
  let result = allPokemons;

  if (query) result = filterByName(result, query);

  const selectedType = refs.typeFilter.value;
  if (selectedType && selectedType !== 'all')
    result = filterByType(result, selectedType);

  const maxWeight = Number(refs.weightRange.value);
  result = filterByWeight(result, 1, maxWeight);

  const maxHeight = Number(refs.heightRange.value);
  result = filterByHeight(result, 1, maxHeight);

  const mode = refs.sortSelect.value;
  if (mode === 'asc') result = sortByNameAZ(result);
  if (mode === 'desc') result = sortByNameZA(result);
  if (mode === 'id-asc') result = sortByIdAsc(result);
  if (mode === 'id-desc') result = sortByIdDesc(result);

  renderPokemonList(result);
}

function morePokemons() {
  if (offset >= totalCount) {
    alert('No more Pokémons to load!');
    return;
  }

  fetchBatch().then(newBatch => {
    renderPokemonList(newBatch, true);
  });
}
