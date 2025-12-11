// Favorites Module - GREEN Phase Implementation
// Key: 'pokemonFavorites' in localStorage

import {
  filterByName,
  sortByNameAZ,
  sortByNameZA,
  sortByIdAsc,
  sortByIdDesc,
  filterByType,
  filterByWeight,
  filterByHeight,
} from '../filter_sort/filter_sort.js';

function favoritesFilterAndSort(favorites) {
  const query = document
    .querySelector('.poke-input')
    .value.trim()
    .toLowerCase();
  const sortMode = document.querySelector('.poke_sort').value;
  const type = document.querySelector('.poke_filter').value;
  const maxWeight = Number(document.getElementById('weight-value').textContent);
  const maxHeight = Number(document.getElementById('height-value').textContent);

  let result = [...favorites];

  // Filtering logic (same as main)
  if (query) result = filterByName(result, query);

  if (type && type !== 'all') result = filterByType(result, type);

  result = filterByWeight(result, 1, maxWeight);
  result = filterByHeight(result, 1, maxHeight);

  // Sorting logic (same as main)
  if (sortMode === 'asc') result = sortByNameAZ(result);
  if (sortMode === 'desc') result = sortByNameZA(result);
  if (sortMode === 'id-asc') result = sortByIdAsc(result);
  if (sortMode === 'id-desc') result = sortByIdDesc(result);

  return result;
}

const STORAGE_KEY = 'pokemonFavorites';

/**
 * Get all favorites from localStorage
 * @returns {Array} Array of favorite Pokemon objects
 */
export function getFavorites() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Save favorites to localStorage
 * @param {Array} favorites - Array of favorite Pokemon objects
 */
function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

/**
 * Check if a Pokemon is already favorited
 * @param {number} pokemonId - Pokemon ID to check
 * @returns {boolean} True if favorited
 */
export function isFavorited(pokemonId) {
  const favorites = getFavorites();
  return favorites.some(pokemon => pokemon.id === pokemonId);
}

/**
 * Add a Pokemon to favorites
 * @param {Object} pokemon - Pokemon object with id, name, sprites, etc.
 */
export function addToFavorites(pokemon) {
  if (isFavorited(pokemon.id)) {
    return; // Prevent duplicates
  }

  const favorites = getFavorites();
  const pokemonData = {
    id: pokemon.id,
    name: pokemon.name,
    sprites: pokemon.sprites,
    weight: pokemon.weight,
    height: pokemon.height,
    abilities: pokemon.abilities,
    types: pokemon.types,
  };

  favorites.push(pokemonData);
  saveFavorites(favorites);
  updateFavoriteCount();
}

/**
 * Remove a Pokemon from favorites
 * @param {number} pokemonId - Pokemon ID to remove
 */
export function removeFromFavorites(pokemonId) {
  let favorites = getFavorites();
  favorites = favorites.filter(pokemon => pokemon.id !== pokemonId);
  saveFavorites(favorites);
  updateFavoriteCount();
  updateFavoritesUI();
}

/**
 * Update the favorites count badge
 */
export function updateFavoriteCount() {
  const favorites = getFavorites();
  const badge = document.querySelector('.favorites-count, .badge');
  if (badge) {
    badge.textContent = favorites.length;
    badge.style.display = favorites.length > 0 ? 'inline-block' : 'none';
  }
}

/**
 * Render the favorites list in the favorites container
 */
export function updateFavoritesUI() {
  const container = document.querySelector('.favorites-container');
  if (!container) return;

  let favorites = getFavorites();

  // 🔥 APPLY SORTING + FILTERING
  favorites = favoritesFilterAndSort(favorites);
  // Always include back button and title
  const headerHTML = `
    <button class="back-to-search-btn">← Back to Search</button>
    <h2 class="favorites-title">Your Favorite Pokemon</h2>
  `;

  if (favorites.length === 0) {
    container.innerHTML = `
      ${headerHTML}
      <div class="empty-state">
        <p>No favorites yet. Add some Pokemon to your favorites!</p>
      </div>
    `;
    setupBackButton();
    return;
  }

  const cardsHTML = favorites
    .map(
      pokemon => `
      <div class="card favorite-card" data-pokemon-id="${pokemon.id}">
        <div class="card-img-top">
          <img class="card-img-top-card" src="${
            pokemon.sprites?.front_default || ''
          }" alt="${pokemon.name}" />
        </div>
        <div class="card-body">
          <h2 class="card-title">Name: ${pokemon.name}</h2>
          <p class="card-text">Weight: ${pokemon.weight || 'N/A'}</p>
          <p class="card-text">Height: ${pokemon.height || 'N/A'}</p>
          <p class="card-text">Height: ${pokemon.height || 'N/A'}</p>
          <h2 class="poke-type-label">Type:</h2>
          <p class="card-text">${(pokemon.types || [])
            .map(t => `<span class='pokemon-type'>${t.type.name}</span>`)
            .join(' ')}</p>
          <button class="remove-from-favorites-btn" data-pokemon-id="${
            pokemon.id
          }">
            Remove from Favorites
          </button>
        </div>
      </div>
    `
    )
    .join('');

  container.innerHTML = `
    ${headerHTML}
    <div class="favorites-container">${cardsHTML}</div>
  `;
  // Add event listeners to remove buttons
  container.querySelectorAll('.remove-from-favorites-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const pokemonId = parseInt(e.target.dataset.pokemonId);
      removeFromFavorites(pokemonId);
    });
  });

  setupBackButton();
}

/**
 * Setup back button event listener
 */
function setupBackButton() {
  const backBtn = document.querySelector('.back-to-search-btn');
  if (backBtn) {
    backBtn.addEventListener('click', e => {
      e.preventDefault();
      hideFavoritesSection();
    });
  }
}

/**
 * Toggle favorites section visibility
 */
export function showFavoritesSection() {
  const favoritesSection = document.querySelector('.favorites-section');
  const mainContent = document.querySelector('.card-container');
  const formBox = document.querySelector('.poke-form_box');
  const openaiSection = document.querySelector('.openai-section');
  const teamSection = document.querySelector('.team-section');

  if (favoritesSection) {
    favoritesSection.style.display = 'block';
    favoritesSection.classList.add('favorites-container');
  }
  if (mainContent) {
    mainContent.style.display = 'none';
  }
  if (formBox) {
    formBox.style.display = 'none';
  }
  if (openaiSection) {
    openaiSection.style.display = 'none';
  }
  if (teamSection) {
    teamSection.style.display = 'none';
  }

  updateFavoritesUI();
}

/**
 * Hide favorites section and show main content
 */
export function hideFavoritesSection() {
  const favoritesSection = document.querySelector('.favorites-section');
  const mainContent = document.querySelector('.card-container');
  const formBox = document.querySelector('.poke-form_box');

  if (favoritesSection) {
    favoritesSection.style.display = 'none';
  }
  if (mainContent) {
    mainContent.style.display = 'flex';
  }
  if (formBox) {
    formBox.style.display = 'block';
  }

  // Sync favorite buttons in search results to reflect current favorites state
  syncFavoriteButtons();
}

/**
 * Sync all favorite buttons in search results to reflect current favorites state
 */
function syncFavoriteButtons() {
  const buttons = document.querySelectorAll('.card-container .add-to-favorites-btn');
  buttons.forEach(btn => {
    const pokemonId = parseInt(btn.dataset.pokemonId);
    if (isFavorited(pokemonId)) {
      btn.textContent = '★ Favorited';
      btn.classList.add('favorited');
    } else {
      btn.textContent = '☆ Add to Favorites';
      btn.classList.remove('favorited');
    }
  });
}

/**
 * Initialize favorites functionality on page load
 */
export function initFavorites() {
  updateFavoriteCount();

  // Set up favorites navigation click handler
  const favoritesLink = document.querySelector(
    '.favorites-link, .favorites-btn'
  );
  if (favoritesLink) {
    favoritesLink.addEventListener('click', e => {
      e.preventDefault();
      showFavoritesSection();
    });
  }

  // Set up back button handler
  const backBtn = document.querySelector('.back-to-search-btn');
  if (backBtn) {
    backBtn.addEventListener('click', e => {
      e.preventDefault();
      hideFavoritesSection();
    });
  }
}

// Make functions available globally for button onclick handlers
if (typeof window !== 'undefined') {
  window.addToFavorites = addToFavorites;
  window.removeFromFavorites = removeFromFavorites;
  window.getFavorites = getFavorites;
  window.isFavorited = isFavorited;
  window.updateFavoritesUI = updateFavoritesUI;
  window.updateFavoriteCount = updateFavoriteCount;
}

// CommonJS exports for Jest testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getFavorites,
    isFavorited,
    addToFavorites,
    removeFromFavorites,
    updateFavoriteCount,
    updateFavoritesUI,
    showFavoritesSection,
    hideFavoritesSection,
    initFavorites,
  };
}
