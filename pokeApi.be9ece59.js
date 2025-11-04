let e={cardContainer:document.querySelector(".card-container")};function t(t){let{sprites:a,name:r,weight:c,height:i,abilities:l}=t,n=l.map(e=>e.ability.name).join(", "),s=`<div class='card'>
<div class='card-img-top'>
  <img class='card-img-top-card' src='${a.front_default}' alt='${r}' />
</div>
<div class='card-body'>
  <h2 class='card-title'>Name: ${r}</h2>
  <p class='card-text'>Weight: ${c}</p>
  <p class='card-text'>Height: ${i}</p>

  <h2 class='card-text'>Skills</h2>
    <ul class='list-group'>
      <li class='list-group-item'>${n}</li>
    </ul>
</div>
</div>`;e.cardContainer.insertAdjacentHTML("beforeend",s)}function a(){alert("алярм алярм!!!  USE NUMBERS!!!")}({cardContainer:document.querySelector(".card-container"),searchForm:document.querySelector(".poke_form")}).searchForm.addEventListener("submit",function(e){var r;e.preventDefault();let c=e.currentTarget;console.log(c.elements);let i=c.elements.query.value.trim();console.log(i),(r=i,fetch(`https://pokeapi.co/api/v2/pokemon/${r}`).then(e=>e.json())).then(t).catch(a).finally(()=>c.reset())});
//# sourceMappingURL=pokeApi.be9ece59.js.map
