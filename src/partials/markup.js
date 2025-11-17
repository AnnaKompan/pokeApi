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
</div>
</div>`;
  refs.cardContainer.insertAdjacentHTML('beforeend', card);
}
