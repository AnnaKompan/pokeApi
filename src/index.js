import { initFavorites } from './js/favorites.js';
import { initOpenAI } from './js/openai.js';

document.addEventListener('DOMContentLoaded', () => {
    initFavorites();
    initOpenAI();
});
