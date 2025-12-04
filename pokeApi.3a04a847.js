var e={};e={filterByName:function(e,t){if(!t)return e;let o=t.toLowerCase();return e.filter(e=>e.name.toLowerCase().startsWith(o))},sortByNameAZ:function(e){return[...e].sort((e,t)=>e.name.localeCompare(t.name))},sortByNameZA:function(e){return[...e].sort((e,t)=>t.name.localeCompare(e.name))},sortByIdAsc:function(e){return[...e].sort((e,t)=>e.id-t.id)},sortByIdDesc:function(e){return[...e].sort((e,t)=>t.id-e.id)},filterByType:function(e,t){let o=Array.isArray(t)?t:[t];return e.filter(e=>e.types.some(e=>o.includes(e.type.name)))},filterByWeight:function(e,t,o){return e.filter(e=>e.weight>=t&&e.weight<=o)},filterByHeight:function(e,t,o){return e.filter(e=>e.height>=t&&e.height<=o)}};let t="pokemonFavorites";function o(){let e=localStorage.getItem(t);return e?JSON.parse(e):[]}function r(e){localStorage.setItem(t,JSON.stringify(e))}function n(e){return o().some(t=>t.id===e)}function a(e){if(n(e.id))return;let t=o(),a={id:e.id,name:e.name,sprites:e.sprites,weight:e.weight,height:e.height,abilities:e.abilities,types:e.types};t.push(a),r(t),s()}function i(e){let t=o();r(t=t.filter(t=>t.id!==e)),s(),c()}function s(){let e=o(),t=document.querySelector(".favorites-count, .badge");t&&(t.textContent=e.length,t.style.display=e.length>0?"inline-block":"none")}function c(){var t;let r,n,a,s,c,d,u=document.querySelector(".favorites-container");if(!u)return;let m=o();t=m,r=document.querySelector(".poke-input").value.trim().toLowerCase(),n=document.querySelector(".poke_sort").value,a=document.querySelector(".poke_filter").value,s=Number(document.getElementById("weight-value").textContent),c=Number(document.getElementById("height-value").textContent),d=[...t],r&&(d=(0,e.filterByName)(d,r)),a&&"all"!==a&&(d=(0,e.filterByType)(d,a)),d=(0,e.filterByWeight)(d,1,s),d=(0,e.filterByHeight)(d,1,c),"asc"===n&&(d=(0,e.sortByNameAZ)(d)),"desc"===n&&(d=(0,e.sortByNameZA)(d)),"id-asc"===n&&(d=(0,e.sortByIdAsc)(d)),"id-desc"===n&&(d=(0,e.sortByIdDesc)(d));let p=`
    <button class="back-to-search-btn">\u{2190} Back to Search</button>
    <h2 class="favorites-title">Your Favorite Pokemon</h2>
  `;if(0===(m=d).length){u.innerHTML=`
      ${p}
      <div class="empty-state">
        <p>No favorites yet. Add some Pokemon to your favorites!</p>
      </div>
    `,l();return}let h=m.map(e=>`
      <div class="card favorite-card" data-pokemon-id="${e.id}">
        <div class="card-img-top">
          <img class="card-img-top-card" src="${e.sprites?.front_default||""}" alt="${e.name}" />
        </div>
        <div class="card-body">
          <h2 class="card-title">Name: ${e.name}</h2>
          <p class="card-text">Weight: ${e.weight||"N/A"}</p>
          <p class="card-text">Height: ${e.height||"N/A"}</p>
          <p class="card-text">Height: ${e.height||"N/A"}</p>
          <h2 class="poke-type-label">Type:</h2>
          <p class="card-text">${(e.types||[]).map(e=>`<span class='pokemon-type'>${e.type.name}</span>`).join(" ")}</p>
          <button class="remove-from-favorites-btn" data-pokemon-id="${e.id}">
            Remove from Favorites
          </button>
        </div>
      </div>
    `).join("");u.innerHTML=`
    ${p}
    <div class="favorites-container">${h}</div>
  `,u.querySelectorAll(".remove-from-favorites-btn").forEach(e=>{e.addEventListener("click",e=>{i(parseInt(e.target.dataset.pokemonId))})}),l()}function l(){let e=document.querySelector(".back-to-search-btn");e&&e.addEventListener("click",e=>{e.preventDefault(),d()})}function d(){let e=document.querySelector(".favorites-section"),t=document.querySelector(".card-container"),o=document.querySelector(".poke-form_box");e&&(e.style.display="none"),t&&(t.style.display="flex"),o&&(o.style.display="block")}function u(){s();let e=document.querySelector(".favorites-link, .favorites-btn");e&&e.addEventListener("click",e=>{let t,o,r;e.preventDefault(),t=document.querySelector(".favorites-section"),o=document.querySelector(".card-container"),r=document.querySelector(".poke-form_box"),t&&(t.style.display="block",t.classList.add("favorites-container")),o&&(o.style.display="none"),r&&(r.style.display="none"),c()});let t=document.querySelector(".back-to-search-btn");t&&t.addEventListener("click",e=>{e.preventDefault(),d()})}function m(e){let t=e.target,o=parseInt(t.dataset.pokemonId),r=JSON.parse(t.dataset.pokemon);n(o)?(i(o),t.textContent="☆ Add to Favorites",t.classList.remove("favorited")):(a(r),t.textContent="★ Favorited",t.classList.add("favorited")),s()}window.addToFavorites=a,window.removeFromFavorites=i,window.getFavorites=o,window.isFavorited=n,window.updateFavoritesUI=c,window.updateFavoriteCount=s,document.querySelector(".card-container");let p={cardContainer:document.querySelector(".card-container"),searchForm:document.querySelector(".poke_form"),sortSelect:document.querySelector(".poke_sort"),typeFilter:document.querySelector(".poke_filter"),searchInput:document.querySelector(".poke-input"),moreBtn:document.querySelector(".more_btn"),weightRange:document.querySelector(".poke_weights_range"),heightRange:document.querySelector(".poke_heights_range"),weightVal:document.getElementById("weight-value"),heightVal:document.getElementById("height-value")},h=[],y=0,f=0;function v(){let e=document.querySelector(".favorites-section");e&&"block"===e.style.display&&updateFavoritesUI()}function g(){return((e=20,t=0)=>fetch(`https://pokeapi.co/api/v2/pokemon?limit=${e}&offset=${t}`).then(e=>{if(!e.ok)throw Error("Failed to fetch Pokémon");return e.json()}))(20,y).then(e=>(f=e.count,Promise.all(e.results.map(e=>fetch(e.url).then(e=>e.json()))))).then(e=>(y+=20,h=[...h,...e],e)).catch(e=>console.error(e))}function k(e,t=!1){t||(p.cardContainer.innerHTML="");let o=e.map(e=>(function(e){let{id:t,sprites:o,name:r,weight:a,height:i,abilities:s,types:c}=e,l=s.map(e=>e.ability.name).join(", "),d=n(t);return`
    <div class='card' data-pokemon-id='${t}'>
      <div class='card-img-top'>
        <img class='card-img-top-card' src='${o.front_default}' alt='${r}' />
      </div>
      <div class='card-body'>
        <h2 class='card-title'>Name: ${r}</h2>
        <p class='card-text'>Weight: ${a}</p>
        <p class='card-text'>Height: ${i}</p>

        <h2 class='card-text'>Skills</h2>
        <ul class='list-group'>
          <li class='list-group-item'>${l}</li>
        </ul>

        <h2 class='poke-type-label'>Type:</h2>
        <p class='card-text'>
          ${c.map(e=>`<span class='pokemon-type'>${e.type.name}</span>`).join(" ")}
        </p>

        <button 
          class='${d?"add-to-favorites-btn favorited":"add-to-favorites-btn"}' 
          data-pokemon-id='${t}' 
          data-pokemon='${JSON.stringify(e).replace(/'/g,"&apos;")}'
        >
          ${d?"★ Favorited":"☆ Add to Favorites"}
        </button>
      </div>
    </div>
  `})(e)).join("");p.cardContainer.insertAdjacentHTML("beforeend",o),p.cardContainer.querySelectorAll(".add-to-favorites-btn").forEach(e=>e.addEventListener("click",m))}function b(e){e.preventDefault(),S(),d()}function S(){let t=p.searchInput.value.trim().toLowerCase(),o=h;t&&(o=(0,e.filterByName)(o,t));let r=p.typeFilter.value;r&&"all"!==r&&(o=(0,e.filterByType)(o,r));let n=Number(p.weightRange.value);o=(0,e.filterByWeight)(o,1,n);let a=Number(p.heightRange.value);o=(0,e.filterByHeight)(o,1,a);let i=p.sortSelect.value;"asc"===i&&(o=(0,e.sortByNameAZ)(o)),"desc"===i&&(o=(0,e.sortByNameZA)(o)),"id-asc"===i&&(o=(0,e.sortByIdAsc)(o)),"id-desc"===i&&(o=(0,e.sortByIdDesc)(o)),k(o)}function w(){y>=f?alert("No more Pokémons to load!"):g().then(e=>{k(e,!0)})}document.addEventListener("DOMContentLoaded",()=>{u(),p.moreBtn.addEventListener("click",w),p.searchInput.addEventListener("input",()=>{S(),v()}),p.searchForm.addEventListener("submit",b),p.sortSelect.addEventListener("change",()=>{S(),v()}),p.typeFilter.addEventListener("change",()=>{S(),v()}),p.weightRange.addEventListener("input",()=>{p.weightVal.textContent=p.weightRange.value,S(),v()}),p.heightRange.addEventListener("input",()=>{p.heightVal.textContent=p.heightRange.value,S(),v()}),g().then(()=>{S()})}),document.addEventListener("DOMContentLoaded",()=>{u()}),p.searchForm.addEventListener("submit",b);
//# sourceMappingURL=pokeApi.3a04a847.js.map
