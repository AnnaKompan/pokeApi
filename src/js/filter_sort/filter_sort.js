function filterByName(pokemonArr, query) {
  if (!query) return pokemonArr;
  const lowerQuery = query.toLowerCase();
  const isNumeric = /^\d+$/.test(query);
  
  return pokemonArr.filter(pokemon => {
    // Match by ID if query is numeric
    if (isNumeric && pokemon.id === parseInt(query)) {
      return true;
    }
    // Match by name (starts with query)
    return pokemon.name.toLowerCase().startsWith(lowerQuery);
  });
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
  return arr.filter(p => {
    // If types is undefined, include the Pokemon (don't filter it out)
    if (!p.types || !Array.isArray(p.types)) return true;
    return p.types.some(t => wanted.includes(t.type.name));
  });
}

function filterByWeight(arr, min, max) {
  return arr.filter(p => {
    // If weight is undefined, include the Pokemon (don't filter it out)
    if (p.weight === undefined || p.weight === null) return true;
    return p.weight >= min && p.weight <= max;
  });
}

function filterByHeight(arr, min, max) {
  return arr.filter(p => {
    // If height is undefined, include the Pokemon (don't filter it out)
    if (p.height === undefined || p.height === null) return true;
    return p.height >= min && p.height <= max;
  });
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
