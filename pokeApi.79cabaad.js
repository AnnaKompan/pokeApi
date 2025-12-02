let e={cardContainer:document.querySelector(".card-container")};var t={};t={filterByName:function(e,t){if(!t)return e;let n=t.toLowerCase();return e.filter(e=>e.name.toLowerCase().startsWith(n))},sortByNameAZ:function(e){return[...e].sort((e,t)=>e.name.localeCompare(t.name))},sortByNameZA:function(e){return[...e].sort((e,t)=>t.name.localeCompare(e.name))},sortByIdAsc:function(e){return[...e].sort((e,t)=>e.id-t.id)},sortByIdDesc:function(e){return[...e].sort((e,t)=>t.id-e.id)},filterByType:function(e,t){let n=Array.isArray(t)?t:[t];return e.filter(e=>e.types.some(e=>n.includes(e.type.name)))},filterByWeight:function(e,t,n){return e.filter(e=>e.weight>=t&&e.weight<=n)},filterByHeight:function(e,t,n){return e.filter(e=>e.height>=t&&e.height<=n)}};let n=[],r=0,a=0,i={cardContainer:document.querySelector(".card-container"),searchForm:document.querySelector(".poke_form"),sortSelect:document.querySelector(".poke_sort"),typeFilter:document.querySelector(".poke_filter"),searchInput:document.querySelector(".poke-input"),moreBtn:document.querySelector(".more_btn"),weightRange:document.getElementById("poke-weight-range"),heightRange:document.getElementById("poke-height-range"),weightVal:document.getElementById("weight-value"),heightVal:document.getElementById("height-value")};function o(){return((e=20,t=0)=>fetch(`https://pokeapi.co/api/v2/pokemon?limit=${e}&offset=${t}`).then(e=>{if(!e.ok)throw Error("Failed to fetch Pokémon");return e.json()}))(20,r).then(e=>(a=e.count,Promise.all(e.results.map(e=>fetch(e.url).then(e=>e.json()))))).then(e=>(r+=20,n=[...n,...e],e)).catch(e=>console.error(e))}function l(t,n=!1){n||(i.cardContainer.innerHTML="");let r=t.map(t=>(function(t){let{sprites:n,name:r,weight:a,height:i,abilities:o}=t,l=o.map(e=>e.ability.name).join(", "),c=`<div class='card'>
<div class='card-img-top'>
  <img class='card-img-top-card' src='${n.front_default}' alt='${r}' />
</div>
<div class='card-body'>
  <h2 class='card-title'>Name: ${r}</h2>
  <p class='card-text'>Weight: ${a}</p>
  <p class='card-text'>Height: ${i}</p>

  <h2 class='card-text'>Skills</h2>
    <ul class='list-group'>
      <li class='list-group-item'>${l}</li>
    </ul>
    <p class='card-text'>
      <h2 class="poke-type-label">Type:</h2>
      ${t.types.map(e=>`<span class='pokemon-type'>${e.type.name}</span>`).join(" ")}
    </p>
</div>
</div>`;e.cardContainer.insertAdjacentHTML("beforeend",c)})(t)).join("");i.cardContainer.insertAdjacentHTML("beforeend",r)}function c(e){e.preventDefault(),s()}function s(){let e=i.searchInput.value.trim().toLowerCase(),r=n;e&&(r=(0,t.filterByName)(r,e));let a=i.typeFilter.value;a&&"all"!==a&&(r=(0,t.filterByType)(r,a));let o=Number(i.weightRange.value);r=(0,t.filterByWeight)(r,1,o);let c=Number(i.heightRange.value);r=(0,t.filterByHeight)(r,1,c);let s=i.sortSelect.value;"asc"===s&&(r=(0,t.sortByNameAZ)(r)),"desc"===s&&(r=(0,t.sortByNameZA)(r)),"id-asc"===s&&(r=(0,t.sortByIdAsc)(r)),"id-desc"===s&&(r=(0,t.sortByIdDesc)(r)),l(r)}function d(){r>=a?alert("No more Pokémons to load!"):o().then(e=>{l(e,!0)})}document.addEventListener("DOMContentLoaded",()=>{i.moreBtn.addEventListener("click",d),i.searchInput.addEventListener("input",s),i.searchForm.addEventListener("submit",c),i.sortSelect.addEventListener("change",s),i.typeFilter.addEventListener("change",s),i.weightRange.addEventListener("input",()=>{i.weightVal.textContent=i.weightRange.value,s()}),i.heightRange.addEventListener("input",()=>{i.heightVal.textContent=i.heightRange.value,s()}),o().then(()=>{s()})});
//# sourceMappingURL=pokeApi.79cabaad.js.map
