import API from './api-service.js';

function setupBackButton() {
  const backBtn = document.querySelector('.openai-section .back-to-search-btn');
  if (backBtn) {
    backBtn.addEventListener('click', e => {
      e.preventDefault();
      hideOpenAISection();
    });
  }
}

function setupOpenAIUI() {
  const openaiSection = document.querySelector('.openai-section');
  if (!openaiSection) return;

  // Check if header already exists to prevent duplicates
  if (openaiSection.querySelector('.back-to-search-btn')) return;

  // Add back button and title at the beginning of openai-section (direct children)
  const headerHTML = `
        <button class="back-to-search-btn">← Back to Search</button>
        <h2 class="openai-title">Ask ChatGPT</h2>
    `;
  const openaiBox = openaiSection.querySelector('.openai-box');
  if (openaiBox) {
    openaiBox.insertAdjacentHTML('beforebegin', headerHTML);
  } else {
    openaiSection.insertAdjacentHTML('afterbegin', headerHTML);
  }
  setupBackButton();
}

/**
 * Show OpenAI section and hide main content
 */
export function showOpenAISection() {
  const openaiSection = document.querySelector('.openai-section');
  const mainContent = document.querySelector('.card-container');
  const formBox = document.querySelector('.poke-form_box');
  const pokeFiltSort = document.querySelector('.poke-filt_sort');
  const moreBtn = document.querySelector('.more_btn');
  const favoritesSection = document.querySelector('.favorites-section');
  const teamSection = document.querySelector('.team-section');

  if (openaiSection) {
    openaiSection.style.display = 'block';
  }
  if (mainContent) {
    mainContent.style.display = 'none';
  }
  if (formBox) {
    formBox.style.display = 'none';
  }
  if (pokeFiltSort) {
    pokeFiltSort.style.display = 'none';
  }
  if (moreBtn) {
    moreBtn.style.display = 'none';
  }
  if (favoritesSection) {
    favoritesSection.style.display = 'none';
  }
  if (teamSection) {
    teamSection.style.display = 'none';
  }
  setupOpenAIUI();
}

/**
 * Hide OpenAI section and show main content
 */
export function hideOpenAISection() {
  const openaiSection = document.querySelector('.openai-section');
  const mainContent = document.querySelector('.card-container');
  const formBox = document.querySelector('.poke-form_box');
  const pokeFiltSort = document.querySelector('.poke-filt_sort');
  const moreBtn = document.querySelector('.more_btn');

  if (openaiSection) {
    openaiSection.style.display = 'none';
  }
  if (mainContent) {
    mainContent.style.display = 'flex';
  }
  if (formBox) {
    formBox.style.display = 'block';
  }
  if (pokeFiltSort) {
    pokeFiltSort.style.display = 'flex';
  }
  if (moreBtn) {
    moreBtn.style.display = 'block';
  }
}

function handleAIQuery() {
  const aiInput = document.getElementById('aiinput');
  const aiResponse = document.querySelector('.openai-response');
  const aiResponseTitle = document.querySelector('.openai-response-title');

  if (aiInput) {
    aiInput.addEventListener('keydown', async e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const userInput = aiInput.value.trim();
        const prompt = `Return a list of Pokémon that are best for the following task. The format should be, one line: pokemon: reason, second line: pokemon: reason, ... and so on. The task is: ${userInput}. Gather a team of capable Pokémon for this task. And give extended reasons for each choice. Example: "
Alakazam: Alakazam has high intelligence and psychic abilities, allowing it to quickly analyze and strategize the most efficient way to clean a space. Its psychic powers also allow it to move objects with ease, making it helpful for heavy lifting during cleaning.

Blissey: Blissey's nurturing nature and ability to heal others make it a great addition to a cleaning team. It can provide emotional support to other Pokémon during the cleaning process and tend to any injuries that may occur.

Lucario: Lucario's fighting abilities make it very agile and proficient at cleaning hard to reach areas. Its steel typing also makes it durable and able to handle tough cleaning tasks."`;
        console.log('Prompt:', prompt); // Log the prompt value

        if (!userInput) return;
        if (aiResponse) aiResponse.textContent = 'Thinking...';
        if (aiResponseTitle) {
          aiResponseTitle.textContent = `The best Pokemon for "${userInput}" is...`;
        }

        try {
          const API_BASE =
            window.location.hostname === 'localhost'
              ? 'http://localhost:3000'
              : 'https://YOUR-RENDER-URL.onrender.com';

          const res = await fetch(`${API_BASE}/api/openai`, {
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
            // Parse the new format: each line is "PokemonName: description"
            const lines = data.result
              .split('\n')
              .filter(line => line.trim().length > 0);
            const pokemonEntries = [];

            lines.forEach(line => {
              const colonIndex = line.indexOf(':');
              if (colonIndex > 0) {
                const pokemonName = line.substring(0, colonIndex).trim();
                const reason = line.substring(colonIndex + 1).trim();
                pokemonEntries.push({ name: pokemonName, reason: reason });
              }
            });

            const list = document.createElement('ul');
            list.className = 'pokemon-list';

            pokemonEntries.forEach(entry => {
              const listItem = document.createElement('li');

              const textDiv = document.createElement('div');
              textDiv.innerHTML = `<strong>${entry.name}:</strong> ${entry.reason}`;
              listItem.appendChild(textDiv);

              API.fetchPokemon(entry.name.toLowerCase())
                .then(pokemonData => {
                  if (
                    pokemonData &&
                    pokemonData.sprites &&
                    pokemonData.sprites.front_default
                  ) {
                    const imageDiv = document.createElement('div');
                    imageDiv.classList.add('pokemon-image');
                    const img = document.createElement('img');
                    img.src = pokemonData.sprites.front_default;
                    img.alt = entry.name;
                    img.classList.add('pokemon-image-tag');
                    imageDiv.appendChild(img);
                    listItem.appendChild(imageDiv);
                  } else {
                    listItem.remove();
                  }
                })
                .catch(error => {
                  console.error(
                    `Error fetching data for ${entry.name}:`,
                    error
                  );
                  listItem.remove();
                });
              list.appendChild(listItem);
            });

            console.log('Pokemon entries:', pokemonEntries);

            aiResponse.innerHTML = '';
            aiResponse.appendChild(list);
          }
        } catch (err) {
          if (aiResponse)
            aiResponse.textContent = `Network error: ${err.message}`;
        } finally {
          aiInput.value = '';
        }
      }
    });
  }
}

export function initOpenAI() {
  const openaiLink = document.querySelector('.openai-link');
  if (openaiLink) {
    openaiLink.addEventListener('click', e => {
      e.preventDefault();
      showOpenAISection();
    });
  }
  handleAIQuery();
}
