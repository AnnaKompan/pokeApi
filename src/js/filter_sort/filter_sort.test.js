const {
  filterByName,
  sortByNameAZ,
  sortByNameZA,
  sortByIdAsc,
  sortByIdDesc,
} = require('./filter_sort');

const pokemons = [
  { name: 'bulbasaur' },
  { name: 'ivysaur' },
  { name: 'venusaur' },
  { name: 'charmander' },
];

describe('Incremental search that filters pokemons as you type', () => {
  test('filter by first letter', () => {
    expect(filterByName(pokemons, 'b')).toEqual([{ name: 'bulbasaur' }]);
    expect(filterByName(pokemons, 'iv')).toEqual([{ name: 'ivysaur' }]);
  });
  test('empty imput returns all pokemons', () => {
    expect(filterByName(pokemons, '')).toEqual(pokemons);
  });
  test('no match returns empty array', () => {
    expect(filterByName(pokemons, 'x')).toEqual([]);
  });
});

const id = [{ id: 8 }, { id: 4 }, { id: 12 }, { id: 10 }];

describe('Sorting pokemons', () => {
  test('sort in alphabetical order (A-Z)', () => {
    expect(sortByNameAZ(pokemons).map(p => p.name)).toEqual([
      'bulbasaur',
      'charmander',
      'ivysaur',
      'venusaur',
    ]);
  });
  test('sort in alphabetical order (Z-A)', () => {
    expect(sortByNameZA(pokemons).map(p => p.name)).toEqual([
      'venusaur',
      'ivysaur',
      'charmander',
      'bulbasaur',
    ]);
  });

  test('sort by ID in descending order', () => {
    expect(sortByIdAsc(id)).toEqual([4, 8, 10, 12]);
  });
  test('sort by ID in ascending order', () => {
    expect(sortByIdDesc(id)).toEqual([12, 10, 8, 4]);
  });
});

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

function loadAll() {
  API.fetchAll(20)
    .then(data => {
      return Promise.all(
        data.results.map(p => fetch(p.url).then(res => res.json()))
      );
    })
    .then(renderPokemonList)
    .catch(console.error);
}
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
