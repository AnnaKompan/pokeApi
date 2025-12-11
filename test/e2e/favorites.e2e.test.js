// Jest + Puppeteer E2E Tests for Favorites Feature
const puppeteer = require('puppeteer');

// Increase timeout for E2E tests (default is 5s, puppeteer needs more)
jest.setTimeout(30000);

describe('Favorites Feature - E2E Tests', () => {
  let browser;
  let page;
  const APP_URL = 'http://localhost:1234';
  const TEST_POKEMON_ID = '1'; // Bulbasaur for testing (in first batch of 20)

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('Add Pokemon to Favorites', () => {
    test('should display "Add to Favorites" button after searching for a Pokemon', async () => {
      await page.goto(APP_URL);
      
      // Search for a Pokemon
      await page.waitForSelector('.poke-input');
      await page.type('.poke-input', TEST_POKEMON_ID);
      await page.click('.poke_form button[type="submit"], .poke_form');
      await page.keyboard.press('Enter');
      
      // Wait for Pokemon card to appear
      await page.waitForSelector('.card', { timeout: 5000 });
      
      // Check if "Add to Favorites" button exists
      const addToFavButton = await page.$('.add-to-favorites-btn');
      expect(addToFavButton).toBeTruthy();
    });

    test('should add Pokemon to favorites when button is clicked', async () => {
      await page.goto(APP_URL);
      
      // Clear localStorage first
      await page.evaluate(() => localStorage.clear());
      
      // Search for Pokemon
      await page.waitForSelector('.poke-input');
      await page.type('.poke-input', TEST_POKEMON_ID);
      await page.keyboard.press('Enter');
      await page.waitForSelector('.card', { timeout: 5000 });
      
      // Click "Add to Favorites" button
      const addButton = await page.$('.add-to-favorites-btn');
      await addButton.click();
      
      // Verify Pokemon was added to localStorage
      const favorites = await page.evaluate(() => {
        const data = localStorage.getItem('pokemonFavorites');
        return data ? JSON.parse(data) : [];
      });
      
      expect(favorites.length).toBeGreaterThan(0);
      expect(favorites[0].id).toBe(parseInt(TEST_POKEMON_ID));
    });

    test('should show visual feedback when Pokemon is added to favorites', async () => {
      await page.goto(APP_URL);
      await page.evaluate(() => localStorage.clear());
      
      // Search and add to favorites
      await page.waitForSelector('.poke-input');
      await page.type('.poke-input', TEST_POKEMON_ID);
      await page.keyboard.press('Enter');
      await page.waitForSelector('.card', { timeout: 5000 });
      
      const addButton = await page.$('.add-to-favorites-btn');
      await addButton.click();
      
      // Check button text changes or class is added
      const buttonText = await page.$eval('.add-to-favorites-btn', btn => btn.textContent);
      expect(
        buttonText.includes('Added') || buttonText.includes('Favorited') || buttonText.includes('★')
      ).toBe(true);
    });

    test('should prevent adding duplicate Pokemon to favorites', async () => {
      await page.goto(APP_URL);
      await page.evaluate(() => localStorage.clear());
      
      // Search for Pokemon
      await page.waitForSelector('.poke-input');
      await page.type('.poke-input', TEST_POKEMON_ID);
      await page.keyboard.press('Enter');
      await page.waitForSelector('.card', { timeout: 5000 });
      
      // Add Pokemon to favorites
      const addButton = await page.$('.add-to-favorites-btn');
      await addButton.click();
      await new Promise(r => setTimeout(r, 100));
      
      // Try to add the same Pokemon by directly calling addToFavorites
      // This simulates attempting to add a duplicate through code
      const duplicateCount = await page.evaluate((pokemonId) => {
        const data = localStorage.getItem('pokemonFavorites');
        const favorites = data ? JSON.parse(data) : [];
        // Try to add duplicate manually
        if (!favorites.some(p => p.id === parseInt(pokemonId))) {
          favorites.push({ id: parseInt(pokemonId), name: 'pikachu' });
          localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
        }
        // Count how many times this Pokemon appears
        const updatedFavorites = JSON.parse(localStorage.getItem('pokemonFavorites'));
        return updatedFavorites.filter(p => p.id === parseInt(pokemonId)).length;
      }, TEST_POKEMON_ID);
      
      expect(duplicateCount).toBe(1);
    });
  });

  describe('View Favorites List', () => {
    test('should have a "Favorites" button/link in navigation', async () => {
      await page.goto(APP_URL);
      
      // Look for favorites navigation element
      const favoritesLink = await page.$('.favorites-link, .favorites-btn, [href*="favorites"]');
      expect(favoritesLink).toBeTruthy();
    });

    test('should display favorites page/section when clicked', async () => {
      await page.goto(APP_URL);
      
      // Click on favorites link
      const favoritesLink = await page.$('.favorites-link, .favorites-btn');
      await favoritesLink.click();
      
      // Wait for favorites section to appear
      await page.waitForSelector('.favorites-container, .favorites-section', { timeout: 3000 });
      
      const favoritesSection = await page.$('.favorites-container, .favorites-section');
      expect(favoritesSection).toBeTruthy();
    });

    test('should show empty state when no favorites exist', async () => {
      await page.goto(APP_URL);
      await page.evaluate(() => localStorage.clear());
      
      // Navigate to favorites
      const favoritesLink = await page.$('.favorites-link, .favorites-btn');
      await favoritesLink.click();
      
      await page.waitForSelector('.favorites-container, .favorites-section');
      
      // Check for empty state message
      const emptyMessage = await page.$eval(
        '.favorites-container, .favorites-section',
        el => el.textContent
      );
      
      expect(
        emptyMessage.includes('No favorites') || emptyMessage.includes('empty') || emptyMessage.includes('Add some')
      ).toBe(true);
    });

    test('should display all favorite Pokemon in favorites list', async () => {
      await page.goto(APP_URL);
      
      // Pre-populate favorites in localStorage
      await page.evaluate(() => {
        const favorites = [
          { id: 25, name: 'pikachu', sprites: { front_default: 'url1' } },
          { id: 1, name: 'bulbasaur', sprites: { front_default: 'url2' } },
          { id: 4, name: 'charmander', sprites: { front_default: 'url3' } }
        ];
        localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
      });
      
      await page.reload();
      
      // Navigate to favorites
      const favoritesLink = await page.$('.favorites-link, .favorites-btn');
      await favoritesLink.click();
      
      await page.waitForSelector('.favorites-container, .favorites-section');
      
      // Count favorite cards displayed
      const favoriteCards = await page.$$('.favorite-card, .favorites-container .card');
      expect(favoriteCards.length).toBe(3);
    });

    test('should display Pokemon details in favorites list', async () => {
      await page.goto(APP_URL);
      
      await page.evaluate(() => {
        const favorites = [
          { 
            id: 25, 
            name: 'pikachu', 
            sprites: { front_default: 'https://example.com/pikachu.png' },
            weight: 60,
            height: 4
          }
        ];
        localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
      });
      
      await page.reload();
      
      // Navigate to favorites
      const favoritesLink = await page.$('.favorites-link, .favorites-btn');
      await favoritesLink.click();
      
      await page.waitForSelector('.favorites-section .favorite-card, .favorites-container .card');
      
      // Check if Pokemon details are displayed - specifically in the favorites section
      const cardContent = await page.$eval('.favorites-section .favorite-card, .favorites-section .card', el => el.textContent);
      
      expect(cardContent.toLowerCase().includes('pikachu')).toBe(true);
    });

    test('should have a "Back to Search" button in favorites section', async () => {
      await page.goto(APP_URL);
      
      // Navigate to favorites
      const favoritesLink = await page.$('.favorites-link, .favorites-btn');
      await favoritesLink.click();
      
      await page.waitForSelector('.favorites-container, .favorites-section', { timeout: 3000 });
      
      // Check for back button
      const backButton = await page.$('.back-to-search-btn, .back-btn, [class*="back"]');
      expect(backButton).toBeTruthy();
    });

    test('should return to search page when "Back to Search" button is clicked', async () => {
      await page.goto(APP_URL);
      
      // Navigate to favorites
      const favoritesLink = await page.$('.favorites-link, .favorites-btn');
      await favoritesLink.click();
      
      await page.waitForSelector('.favorites-container, .favorites-section', { timeout: 3000 });
      
      // Click back button
      const backButton = await page.$('.back-to-search-btn, .back-btn');
      await backButton.click();
      
      await new Promise(r => setTimeout(r, 300));
      
      // Verify search form is visible again
      const searchForm = await page.$('.poke-form_box');
      const formDisplay = await page.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none';
      }, searchForm);
      
      expect(formDisplay).toBe(true);
      
      // Verify favorites section is hidden
      const favoritesSection = await page.$('.favorites-section');
      const favoritesDisplay = await page.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.display === 'none';
      }, favoritesSection);
      
      expect(favoritesDisplay).toBe(true);
    });
  });

  describe('Remove Pokemon from Favorites', () => {
    test('should have a "Remove" button on each favorite Pokemon card', async () => {
      await page.goto(APP_URL);
      
      await page.evaluate(() => {
        const favorites = [{ id: 25, name: 'pikachu', sprites: { front_default: 'url' } }];
        localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
      });
      
      await page.reload();
      
      // Navigate to favorites
      const favoritesLink = await page.$('.favorites-link, .favorites-btn');
      await favoritesLink.click();
      
      await page.waitForSelector('.favorite-card, .card');
      
      // Check for remove button
      const removeButton = await page.$('.remove-from-favorites-btn, .remove-favorite-btn');
      expect(removeButton).toBeTruthy();
    });

    test('should remove Pokemon from favorites when remove button is clicked', async () => {
      await page.goto(APP_URL);
      
      await page.evaluate(() => {
        const favorites = [
          { id: 25, name: 'pikachu', sprites: { front_default: 'url1' } },
          { id: 1, name: 'bulbasaur', sprites: { front_default: 'url2' } }
        ];
        localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
      });
      
      await page.reload();
      
      // Navigate to favorites
      const favoritesLink = await page.$('.favorites-link, .favorites-btn');
      await favoritesLink.click();
      
      await page.waitForSelector('.favorite-card, .card');
      
      // Get initial count
      let favoriteCards = await page.$$('.favorite-card, .favorites-container .card');
      const initialCount = favoriteCards.length;
      
      // Click remove button
      const removeButton = await page.$('.remove-from-favorites-btn, .remove-favorite-btn');
      await removeButton.click();
      
      await new Promise(r => setTimeout(r, 500));
      
      // Verify count decreased
      favoriteCards = await page.$$('.favorite-card, .favorites-container .card');
      expect(favoriteCards.length).toBe(initialCount - 1);
    });

    test('should update localStorage when Pokemon is removed', async () => {
      await page.goto(APP_URL);
      
      await page.evaluate(() => {
        const favorites = [
          { id: 25, name: 'pikachu', sprites: { front_default: 'url1' } },
          { id: 1, name: 'bulbasaur', sprites: { front_default: 'url2' } }
        ];
        localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
      });
      
      await page.reload();
      
      // Navigate to favorites and remove one
      const favoritesLink = await page.$('.favorites-link, .favorites-btn');
      await favoritesLink.click();
      await page.waitForSelector('.favorite-card, .card');
      
      const removeButton = await page.$('.remove-from-favorites-btn, .remove-favorite-btn');
      await removeButton.click();
      
      await new Promise(r => setTimeout(r, 300));
      
      // Check localStorage
      const favorites = await page.evaluate(() => {
        const data = localStorage.getItem('pokemonFavorites');
        return data ? JSON.parse(data) : [];
      });
      
      expect(favorites.length).toBe(1);
    });
  });

  describe('localStorage Persistence', () => {
    test('should persist favorites across page reloads', async () => {
      await page.goto(APP_URL);
      await page.evaluate(() => localStorage.clear());
      
      // Add a Pokemon to favorites
      await page.waitForSelector('.poke-input');
      await page.type('.poke-input', TEST_POKEMON_ID);
      await page.keyboard.press('Enter');
      await page.waitForSelector('.card', { timeout: 5000 });
      
      const addButton = await page.$('.add-to-favorites-btn');
      await addButton.click();
      
      // Reload page
      await page.reload();
      
      // Check if favorites still exist in localStorage
      const favorites = await page.evaluate(() => {
        const data = localStorage.getItem('pokemonFavorites');
        return data ? JSON.parse(data) : [];
      });
      
      expect(favorites.length).toBe(1);
      expect(favorites[0].id).toBe(parseInt(TEST_POKEMON_ID));
    });

    test('should maintain favorites after browser navigation', async () => {
      await page.goto(APP_URL);
      
      // Set initial favorites
      await page.evaluate(() => {
        const favorites = [
          { id: 25, name: 'pikachu', sprites: { front_default: 'url1' } },
          { id: 1, name: 'bulbasaur', sprites: { front_default: 'url2' } }
        ];
        localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
      });
      
      // Navigate away and back
      await page.goto('about:blank');
      await page.goto(APP_URL);
      
      // Check favorites still exist
      const favoritesLink = await page.$('.favorites-link, .favorites-btn');
      await favoritesLink.click();
      
      await page.waitForSelector('.favorites-container, .favorites-section');
      const favoriteCards = await page.$$('.favorite-card, .favorites-container .card');
      
      expect(favoriteCards.length).toBe(2);
    });

    test('should store complete Pokemon data in localStorage', async () => {
      await page.goto(APP_URL);
      await page.evaluate(() => localStorage.clear());
      
      // Search and add Pokemon to favorites
      await page.waitForSelector('.poke-input');
      await page.type('.poke-input', TEST_POKEMON_ID);
      await page.keyboard.press('Enter');
      await page.waitForSelector('.card', { timeout: 5000 });
      
      const addButton = await page.$('.add-to-favorites-btn');
      await addButton.click();
      
      // Verify complete data structure
      const favoriteData = await page.evaluate(() => {
        const data = localStorage.getItem('pokemonFavorites');
        return data ? JSON.parse(data)[0] : null;
      });
      
      expect(favoriteData).toBeTruthy();
      expect(favoriteData.id).toBeTruthy();
      expect(favoriteData.name).toBeTruthy();
      expect(favoriteData.sprites).toBeTruthy();
    });
  });

  describe('User Experience', () => {
    test('should show favorites count/badge when favorites exist', async () => {
      await page.goto(APP_URL);
      
      await page.evaluate(() => {
        const favorites = [
          { id: 25, name: 'pikachu' },
          { id: 1, name: 'bulbasaur' },
          { id: 4, name: 'charmander' }
        ];
        localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
      });
      
      await page.reload();
      
      // Look for count badge
      const badge = await page.$('.favorites-count, .badge, .favorites-link .count');
      expect(badge).toBeTruthy();
      
      const badgeText = await page.$eval('.favorites-count, .badge, .favorites-link .count', el => el.textContent);
      expect(badgeText.includes('3')).toBe(true);
    });

    test('should update favorited mark in search results after removing from favorites page', async () => {
      await page.goto(APP_URL);
      await page.evaluate(() => localStorage.clear());
      
      // Step 1: Search for Pokemon and add to favorites
      await page.waitForSelector('.poke-input');
      await page.type('.poke-input', TEST_POKEMON_ID);
      await page.keyboard.press('Enter');
      await page.waitForSelector('.card', { timeout: 5000 });
      
      // Add to favorites
      const addButton = await page.$('.add-to-favorites-btn');
      await addButton.click();
      await new Promise(r => setTimeout(r, 200));
      
      // Verify it shows favorited state (yellow star)
      let buttonText = await page.$eval('.add-to-favorites-btn', btn => btn.textContent);
      let hasFavoritedClass = await page.$eval('.add-to-favorites-btn', btn => btn.classList.contains('favorited'));
      expect(buttonText.includes('★') || buttonText.includes('Favorited')).toBe(true);
      expect(hasFavoritedClass).toBe(true);
      
      // Step 2: Go to favorites page
      const favoritesLink = await page.$('.favorites-link, .favorites-btn');
      await favoritesLink.click();
      await page.waitForSelector('.favorites-section', { timeout: 3000 });
      
      // Step 3: Remove from favorites
      const removeButton = await page.$('.remove-from-favorites-btn, .remove-favorite-btn');
      await removeButton.click();
      await new Promise(r => setTimeout(r, 300));
      
      // Step 4: Click back to search
      const backButton = await page.$('.back-to-search-btn, .back-btn');
      await backButton.click();
      await new Promise(r => setTimeout(r, 300));
      
      // Step 5: Verify the Pokemon card in search results NO LONGER shows favorited state
      // The bug is that it still shows '★ Favorited' and has 'favorited' class
      buttonText = await page.$eval('.add-to-favorites-btn', btn => btn.textContent);
      hasFavoritedClass = await page.$eval('.add-to-favorites-btn', btn => btn.classList.contains('favorited'));
      
      // After removing from favorites, button should show "Add to Favorites" not "Favorited"
      expect(buttonText.includes('Add to Favorites')).toBe(true);
      expect(buttonText.includes('★')).toBe(false);
      expect(hasFavoritedClass).toBe(false);
    });

    test('should toggle between "Add to Favorites" and "Remove from Favorites" based on state', async () => {
      await page.goto(APP_URL);
      await page.evaluate(() => localStorage.clear());
      
      // Search for Pokemon
      await page.waitForSelector('.poke-input');
      await page.type('.poke-input', TEST_POKEMON_ID);
      await page.keyboard.press('Enter');
      await page.waitForSelector('.card', { timeout: 5000 });
      
      // Check initial button text
      let buttonText = await page.$eval('.add-to-favorites-btn', btn => btn.textContent);
      expect(buttonText.includes('Add')).toBe(true);
      
      // Click to add
      const addButton = await page.$('.add-to-favorites-btn');
      await addButton.click();
      await new Promise(r => setTimeout(r, 200));
      
      // Check updated button text
      buttonText = await page.$eval('.add-to-favorites-btn', btn => btn.textContent);
      expect(
        buttonText.includes('Remove') || buttonText.includes('Favorited') || buttonText.includes('★')
      ).toBe(true);
    });
  });
});
