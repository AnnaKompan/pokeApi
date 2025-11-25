// const searchInput = document.querySelector('.poke-input');

function filterByName(pokemonArr, query) {
  if (!query) return pokemonArr;
  const lowerQuery = query.toLowerCase();
  return pokemonArr.filter(pokemon =>
    pokemon.name.toLowerCase().startsWith(lowerQuery)
  );
}

function sortByNameAZ(arr) {
  return [...arr].sort((a, b) => a.name.localeCompare(b.name));
}
function sortByNameZA(arr) {
  return [...arr].sort((a, b) => b.name.localeCompare(a.name));
}
function sortByIdAsc(arr) {
  return [...arr].sort((a, b) => a.id - b.id);
}
function sortByIdDesc(arr) {
  return [...arr].sort((a, b) => b.id - a.id);
}

module.exports = {
  filterByName,
  sortByNameAZ,
  sortByNameZA,
  sortByIdAsc,
  sortByIdDesc,
};
