const e={cardContainer:document.querySelector(".card-container")};function t(t){const{sprites:n,name:c,weight:a,height:r,abilities:o}=t,i=o.map((e=>e.ability.name)).join(", "),s=`<div class='card'>\n<div class='card-img-top'>\n  <img class='card-img-top-card' src='${n.front_default}' alt='${c}' />\n</div>\n<div class='card-body'>\n  <h2 class='card-title'>Name: ${c}</h2>\n  <p class='card-text'>Weight: ${a}</p>\n  <p class='card-text'>Height: ${r}</p>\n\n  <h2 class='card-text'>Skills</h2>\n    <ul class='list-group'>\n      <li class='list-group-item'>${i}</li>\n    </ul>\n</div>\n</div>`;e.cardContainer.insertAdjacentHTML("beforeend",s)}var n={fetchPokemon:function(e){return fetch(`https://pokeapi.co/api/v2/pokemon/${e}`).then((e=>e.json()))}};function c(){alert("алярм алярм!!!  USE NUMBERS!!!")}({cardContainer:document.querySelector(".card-container"),searchForm:document.querySelector(".poke_form")}).searchForm.addEventListener("submit",(function(e){e.preventDefault();const a=e.currentTarget;console.log(a.elements);const r=a.elements.query.value.trim();console.log(r),n.fetchPokemon(r).then(t).catch(c).finally((()=>a.reset()))}));
//# sourceMappingURL=index.6c226ca4.js.map