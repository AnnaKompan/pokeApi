const {
  filterByName,
  sortByNameAZ,
  sortByNameZA,
  sortByIdAsc,
  sortByIdDesc,
  filterByType,
  filterByHeight,
  filterByWeight,
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

  test('sort by ID in ascending order', () => {
    expect(sortByIdAsc(id)).toEqual([
      { id: 4 },
      { id: 8 },
      { id: 10 },
      { id: 12 },
    ]);
  });
  test('sort by ID in descending order', () => {
    expect(sortByIdDesc(id)).toEqual([
      { id: 12 },
      { id: 10 },
      { id: 8 },
      { id: 4 },
    ]);
  });
});

describe('filter by type', () => {
  const pokemons_types = [
    {
      name: 'bulbasaur',
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    },
    {
      name: 'ivysaur',
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    },
    {
      name: 'venusaur',
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    },
    {
      name: 'charmander',
      types: [{ type: { name: 'fire' } }],
    },
  ];
  test('filter by one match', () => {
    expect(filterByType(pokemons_types, 'fire')).toEqual([pokemons_types[3]]);
  });
  test('filter by multiple types of multiple pokemons', () => {
    const q_arr = ['grass', 'poison'];
    expect(filterByType(pokemons_types, q_arr)).toEqual([
      pokemons_types[0],
      pokemons_types[1],
      pokemons_types[2],
    ]);
  });
  test('return empty arrat if no match for type', () => {
    expect(filterByType(pokemons_types, 'dragon')).toEqual([]);
  });
});

describe('filter by weight using slider', () => {
  const arr = [
    { name: 'a', weight: 10 },
    { name: 'b', weight: 100 },
    { name: 'c', weight: 200 },
  ];
  test('filter within weight range', () => {
    expect(filterByWeight(arr, 50, 150)).toEqual([arr[1]]);
  });

  test('return empty arr if no pokemons match weight', () => {
    expect(filterByWeight(arr, 250, 300)).toEqual([]);
  });

  test('return multiple matches for weight range', () => {
    expect(filterByWeight(arr, 5, 150)).toEqual([arr[0], arr[1]]);
  });
});

describe('filter by height using slider', () => {
  const arr = [
    { name: 'a', height: 5 },
    { name: 'b', height: 10 },
    { name: 'c', height: 30 },
  ];
  test('filter within height range', () => {
    expect(filterByHeight(arr, 8, 25)).toEqual([arr[1]]);
  });

  test('return empty arr if no pokemons match height', () => {
    expect(filterByHeight(arr, 40, 50)).toEqual([]);
  });

  test('return multiple matches for height range', () => {
    expect(filterByHeight(arr, 5, 40)).toEqual([arr[0], arr[1], arr[2]]);
  });
});
