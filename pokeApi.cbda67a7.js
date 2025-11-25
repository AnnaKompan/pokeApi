let e={cardContainer:document.querySelector(".card-container")};var t={fetchPokemon:function(e){return fetch(`https://pokeapi.co/api/v2/pokemon/${e}`).then(e=>e.json())}},r={};r={filterByName:function(e,t){if(!t)return e;let r=t.toLowerCase();return e.filter(e=>e.name.toLowerCase().startsWith(r))},sortByNameAZ:function(e){return[...e].sort((e,t)=>e.name.localeCompare(t.name))},sortByNameZA:function(e){return[...e].sort((e,t)=>t.name.localeCompare(e.name))},sortByIdAsc:function(e){return[...e].sort((e,t)=>e.id-t.id)},sortByIdDesc:function(e){return[...e].sort((e,t)=>t.id-e.id)}};let n=[],o=0,c=0,a={cardContainer:document.querySelector(".card-container"),searchForm:document.querySelector(".poke_form"),sortSelect:document.querySelector(".poke_sort"),filterSelect:document.querySelector(".poke_filter"),searchInput:document.querySelector(".poke-input"),moreBtn:document.querySelector(".more_btn")};function i(){return t.fetchAll(20,o).then(e=>(c=e.count,Promise.all(e.results.map(e=>fetch(e.url).then(e=>e.json()))))).then(e=>(o+=20,n=[...n,...e],e)).catch(e=>console.error(e))}function s(t,r=!1){r||(a.cardContainer.innerHTML="");let n=t.map(t=>(function(t){let{sprites:r,name:n,weight:o,height:c,abilities:a}=t,i=a.map(e=>e.ability.name).join(", "),s=`<div class='card'>
<div class='card-img-top'>
  <img class='card-img-top-card' src='${r.front_default}' alt='${n}' />
</div>
<div class='card-body'>
  <h2 class='card-title'>Name: ${n}</h2>
  <p class='card-text'>Weight: ${o}</p>
  <p class='card-text'>Height: ${c}</p>

  <h2 class='card-text'>Skills</h2>
    <ul class='list-group'>
      <li class='list-group-item'>${i}</li>
    </ul>
</div>
</div>`;e.cardContainer.insertAdjacentHTML("beforeend",s)})(t)).join("");a.cardContainer.insertAdjacentHTML("beforeend",n)}function l(){let e=a.searchInput.value.trim().toLowerCase(),t=n;e&&(t=(0,r.filterByName)(t,e));let o=a.filterSelect.value;o&&"all"!==o&&(t=(0,r.filterByType)(t,o));let c=a.sortSelect.value;"asc"===c&&(t=(0,r.sortByNameAZ)(t)),"desc"===c&&(t=(0,r.sortByNameZA)(t)),"id-asc"===c&&(t=(0,r.sortByIdAsc)(t)),"id-desc"===c&&(t=(0,r.sortByIdDesc)(t)),s(t)}a.moreBtn.addEventListener("click",function(){o>=c?alert("No more Pokémons to load!"):i().then(e=>{s(e,!0)})}),document.addEventListener("DOMContentLoaded",function(){i().then(()=>{l()})}),a.searchInput.addEventListener("input",l),a.searchForm.addEventListener("submit",function(e){e.preventDefault(),l()}),a.sortSelect.addEventListener("change",l),a.filterSelect.addEventListener("change",l);
//# sourceMappingURL=pokeApi.cbda67a7.js.map
