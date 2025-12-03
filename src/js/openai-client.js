import API from './api-service.js';

const aiInput = document.getElementById('aiinput');
const aiResponse = document.querySelector('.openai-response');
const aiResponseTitle = document.querySelector('.openai-response-title');

if (aiInput) {
  aiInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const userInput = aiInput.value.trim();
      const prompt = `Return a list of Pokémon that are best for the following task. The format should be: pokemon, reason, pokemon, reason, ... and so on, I want a comma-separated list .csv-like, with special characters except comma. The response should only contain the list, with no other text. The task is: ${userInput}`;
      console.log('Prompt:', prompt); // Log the prompt value

      if (!userInput) return;
      if (aiResponse) aiResponse.textContent = 'Thinking...';
      if (aiResponseTitle) {
        aiResponseTitle.textContent = `The best Pokemon for "${userInput}" is...`;
      }

      try {
        const res = await fetch('http://localhost:3000/api/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
          const text = await res.text();
          if (aiResponse) aiResponse.textContent = `Error: ${text}`;
          return;
        }

        const data = await res.json();
        console.log('OpenAI Server Response:', data);
        if (aiResponse) {
          const results = data.result.split(',').map(item => item.trim());
          const pokemonNames = [];
          const list = document.createElement('ul');
          list.className = 'pokemon-list';

          for (let i = 0; i < results.length; i += 2) {
            const pokemonName = results[i];
            const reason = results[i + 1];
            pokemonNames.push(pokemonName);

            const listItem = document.createElement('li');
            
            const textDiv = document.createElement('div');
            textDiv.innerHTML = `<strong>${pokemonName}:</strong> ${reason}`;
            listItem.appendChild(textDiv);
            
            API.fetchPokemon(pokemonName.toLowerCase()).then(pokemonData => {
              if (pokemonData && pokemonData.sprites && pokemonData.sprites.front_default) {
                const imageDiv = document.createElement('div');
                imageDiv.classList.add('pokemon-image');
                const img = document.createElement('img');
                img.src = pokemonData.sprites.front_default;
                img.alt = pokemonName;
                img.classList.add('pokemon-image-tag');
                imageDiv.appendChild(img);
                listItem.appendChild(imageDiv);
              } else {
                // If the image doesn't exist, remove the list item
                listItem.remove();
              }
            }).catch(error => {
              console.error(`Error fetching data for ${pokemonName}:`, error);
              // On error (e.g., Pokémon not found), remove the list item
              listItem.remove();
            });
            list.appendChild(listItem);
          }

          // We will use this list later to fetch images of the pokemon
          console.log('Pokemon names:', pokemonNames);

          aiResponse.innerHTML = '';
          aiResponse.appendChild(list);
        }
      } catch (err) {
        if (aiResponse) aiResponse.textContent = `Network error: ${err.message}`;
      } finally {
        aiInput.value = '';
      }
    }
  });
}
