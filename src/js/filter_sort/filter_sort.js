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

function filterByType(arr, type) {
  const wanted = Array.isArray(type) ? type : [type];
  return arr.filter(p => p.types.some(t => wanted.includes(t.type.name)));
}

function filterByWeight(arr, min, max) {
  return arr.filter(p => p.weight >= min && p.weight <= max);
}

function filterByHeight(arr, min, max) {
  return arr.filter(p => p.height >= min && p.height <= max);
}

module.exports = {
  filterByName,
  sortByNameAZ,
  sortByNameZA,
  sortByIdAsc,
  sortByIdDesc,
  filterByType,
  filterByWeight,
  filterByHeight,
};
