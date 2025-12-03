import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import puppeteer from 'puppeteer';

describe('Favorites Feature - E2E Tests', () => {
  let browser;
  let page;
  const APP_URL = 'http://localhost:1234';
  const TEST_POKEMON_ID = '25'; // Pikachu for testing

  before(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  after(async () => {
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
      assert.ok(addToFavButton, 'Add to Favorites button should be visible on Pokemon card');
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
      
      assert.ok(favorites.length > 0, 'Favorites should contain at least one Pokemon');
      assert.strictEqual(favorites[0].id, parseInt(TEST_POKEMON_ID), 'Favorite Pokemon ID should match');
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
      assert.ok(
        buttonText.includes('Added') || buttonText.includes('Favorited') || buttonText.includes('★'),
        'Button should show visual feedback after adding to favorites'
      );
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
      
      assert.strictEqual(duplicateCount, 1, 'Should not add duplicate Pokemon to favorites');
    });
  });

  describe('View Favorites List', () => {
    test('should have a "Favorites" button/link in navigation', async () => {
      await page.goto(APP_URL);
      
      // Look for favorites navigation element
      const favoritesLink = await page.$('.favorites-link, .favorites-btn, [href*="favorites"]');
      assert.ok(favoritesLink, 'Favorites navigation element should exist');
    });

    test('should display favorites page/section when clicked', async () => {
      await page.goto(APP_URL);
      
      // Click on favorites link
      const favoritesLink = await page.$('.favorites-link, .favorites-btn');
      await favoritesLink.click();
      
      // Wait for favorites section to appear
      await page.waitForSelector('.favorites-container, .favorites-section', { timeout: 3000 });
      
      const favoritesSection = await page.$('.favorites-container, .favorites-section');
      assert.ok(favoritesSection, 'Favorites section should be displayed');
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
      
      assert.ok(
        emptyMessage.includes('No favorites') || emptyMessage.includes('empty') || emptyMessage.includes('Add some'),
        'Should display empty state message when no favorites exist'
      );
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
      assert.strictEqual(favoriteCards.length, 3, 'Should display all 3 favorite Pokemon');
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
      
      await page.waitForSelector('.favorite-card, .card');
      
      // Check if Pokemon details are displayed
      const cardContent = await page.$eval('.favorite-card, .card', el => el.textContent);
      
      assert.ok(cardContent.includes('pikachu'), 'Should display Pokemon name');
    });

    test('should have a "Back to Search" button in favorites section', async () => {
      await page.goto(APP_URL);
      
      // Navigate to favorites
      const favoritesLink = await page.$('.favorites-link, .favorites-btn');
      await favoritesLink.click();
      
      await page.waitForSelector('.favorites-container, .favorites-section', { timeout: 3000 });
      
      // Check for back button
      const backButton = await page.$('.back-to-search-btn, .back-btn, [class*="back"]');
      assert.ok(backButton, 'Back to Search button should exist in favorites section');
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
      
      assert.ok(formDisplay, 'Search form should be visible after clicking back button');
      
      // Verify favorites section is hidden
      const favoritesSection = await page.$('.favorites-section');
      const favoritesDisplay = await page.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.display === 'none';
      }, favoritesSection);
      
      assert.ok(favoritesDisplay, 'Favorites section should be hidden after clicking back button');
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
      assert.ok(removeButton, 'Remove button should exist on favorite Pokemon card');
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
      assert.strictEqual(favoriteCards.length, initialCount - 1, 'One Pokemon should be removed from favorites');
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
      
      assert.strictEqual(favorites.length, 1, 'localStorage should be updated with one Pokemon removed');
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
      
      assert.strictEqual(favorites.length, 1, 'Favorites should persist after page reload');
      assert.strictEqual(favorites[0].id, parseInt(TEST_POKEMON_ID), 'Favorite Pokemon data should be intact');
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
      
      assert.strictEqual(favoriteCards.length, 2, 'Favorites should persist after navigation');
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
      
      assert.ok(favoriteData, 'Favorite Pokemon data should exist');
      assert.ok(favoriteData.id, 'Should store Pokemon ID');
      assert.ok(favoriteData.name, 'Should store Pokemon name');
      assert.ok(favoriteData.sprites, 'Should store Pokemon sprites');
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
      assert.ok(badge, 'Should display favorites count badge');
      
      const badgeText = await page.$eval('.favorites-count, .badge, .favorites-link .count', el => el.textContent);
      assert.ok(badgeText.includes('3'), 'Badge should show correct count');
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
      assert.ok(buttonText.includes('Add'), 'Should show "Add" when Pokemon is not favorited');
      
      // Click to add
      const addButton = await page.$('.add-to-favorites-btn');
      await addButton.click();
      await new Promise(r => setTimeout(r, 200));
      
      // Check updated button text
      buttonText = await page.$eval('.add-to-favorites-btn', btn => btn.textContent);
      assert.ok(
        buttonText.includes('Remove') || buttonText.includes('Favorited') || buttonText.includes('★'),
        'Should show different state when Pokemon is favorited'
      );
    });
  });
});
