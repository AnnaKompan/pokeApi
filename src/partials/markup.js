const refs = {
  cardContainer: document.querySelector('.card-container'),
};

export default function pokemonCardTpl(pokemon) {
  const { sprites, name, weight, height, abilities } = pokemon;
  const abilityName = abilities.map(ability => ability.ability.name).join(', ');
  const card = `<div class='card'>
<div class='card-img-top'>
  <img class='card-img-top-card' src='${sprites.front_default}' alt='${name}' />
</div>
<div class='card-body'>
  <h2 class='card-title'>Name: ${name}</h2>
  <p class='card-text'>Weight: ${weight}</p>
  <p class='card-text'>Height: ${height}</p>

  <h2 class='card-text'>Skills</h2>
    <ul class='list-group'>
      <li class='list-group-item'>${abilityName}</li>
    </ul>
    <p class='card-text'>
      <h2 class="poke-type-label">Type:</h2>
      ${pokemon.types
        .map(t => `<span class='pokemon-type'>${t.type.name}</span>`)
        .join(' ')}
    </p>
</div>
</div>`;
  refs.cardContainer.insertAdjacentHTML('beforeend', card);
}
