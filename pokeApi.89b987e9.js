let e={cardContainer:document.querySelector(".card-container")};var t={};t={filterByName:function(e,t){if(!t)return e;let r=t.toLowerCase();return e.filter(e=>e.name.toLowerCase().startsWith(r))},sortByNameAZ:function(e){return[...e].sort((e,t)=>e.name.localeCompare(t.name))},sortByNameZA:function(e){return[...e].sort((e,t)=>t.name.localeCompare(e.name))},sortByIdAsc:function(e){return[...e].sort((e,t)=>e.id-t.id)},sortByIdDesc:function(e){return[...e].sort((e,t)=>t.id-e.id)}};let r=[],n=0,o=0,a={cardContainer:document.querySelector(".card-container"),searchForm:document.querySelector(".poke_form"),sortSelect:document.querySelector(".poke_sort"),filterSelect:document.querySelector(".poke_filter"),searchInput:document.querySelector(".poke-input"),moreBtn:document.querySelector(".more_btn")};function c(){return((e=20,t=0)=>fetch(`https://pokeapi.co/api/v2/pokemon?limit=${e}&offset=${t}`).then(e=>{if(!e.ok)throw Error("Failed to fetch Pokémon");return e.json()}))(20,n).then(e=>(o=e.count,Promise.all(e.results.map(e=>fetch(e.url).then(e=>e.json()))))).then(e=>(n+=20,r=[...r,...e],e)).catch(e=>console.error(e))}function i(t,r=!1){r||(a.cardContainer.innerHTML="");let n=t.map(t=>(function(t){let{sprites:r,name:n,weight:o,height:a,abilities:c}=t,i=c.map(e=>e.ability.name).join(", "),s=`<div class='card'>
<div class='card-img-top'>
  <img class='card-img-top-card' src='${r.front_default}' alt='${n}' />
</div>
<div class='card-body'>
  <h2 class='card-title'>Name: ${n}</h2>
  <p class='card-text'>Weight: ${o}</p>
  <p class='card-text'>Height: ${a}</p>

  <h2 class='card-text'>Skills</h2>
    <ul class='list-group'>
      <li class='list-group-item'>${i}</li>
    </ul>
</div>
</div>`;e.cardContainer.insertAdjacentHTML("beforeend",s)})(t)).join("");a.cardContainer.insertAdjacentHTML("beforeend",n)}function s(){let e=a.searchInput.value.trim().toLowerCase(),n=r;e&&(n=(0,t.filterByName)(n,e));let o=a.filterSelect.value;o&&"all"!==o&&(n=(0,t.filterByType)(n,o));let c=a.sortSelect.value;"asc"===c&&(n=(0,t.sortByNameAZ)(n)),"desc"===c&&(n=(0,t.sortByNameZA)(n)),"id-asc"===c&&(n=(0,t.sortByIdAsc)(n)),"id-desc"===c&&(n=(0,t.sortByIdDesc)(n)),i(n)}a.moreBtn.addEventListener("click",function(){n>=o?alert("No more Pokémons to load!"):c().then(e=>{i(e,!0)})}),document.addEventListener("DOMContentLoaded",function(){c().then(()=>{s()})}),a.searchInput.addEventListener("input",s),a.searchForm.addEventListener("submit",function(e){e.preventDefault(),s()}),a.sortSelect.addEventListener("change",s),a.filterSelect.addEventListener("change",s);
//# sourceMappingURL=pokeApi.89b987e9.js.map
