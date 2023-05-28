// import pokemonCardTpl from '../partials/markup.hbs';
import pokemonCardTpl from '../partials/markup';
import API from '../js/api-service';

const refs = {
  cardContainer: document.querySelector('.card-container'),
  searchForm: document.querySelector('.poke_form'),
};

// fetch('https://pokeapi.co/api/v2/pokemon/2')
//   .then(response => {
//     return response.json();
//   })
//   .then(respJson => {
//     console.log(respJson);
//   });

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

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

// function filter() {}
