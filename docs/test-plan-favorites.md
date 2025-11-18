# Favorites Feature - E2E Test Plan
 
**Test File:** `test/e2e/favorites.e2e.test.js`  
**Status:** Week 1 - RED Phase (Tests Written, All Failing)  
**Total Tests:** 18

## Test Coverage

### 1. Add Pokemon to Favorites (4 tests)
- Display "Add to Favorites" button after Pokemon search
- Add Pokemon to localStorage when button clicked
- Show visual feedback (button state change) after adding
- Prevent duplicate Pokemon in favorites

### 2. View Favorites List (5 tests)
- Favorites navigation button/link exists
- Display favorites page/section when clicked
- Show empty state message when no favorites exist
- Display all favorite Pokemon in list
- Show Pokemon details (name, image, stats) in favorites

### 3. Remove from Favorites (3 tests)
- Remove button exists on each favorite card
- Remove Pokemon from list when clicked
- Update localStorage after removal

### 4. localStorage Persistence (3 tests)
- Favorites persist across page reloads
- Favorites persist after browser navigation
- Store complete Pokemon data (id, name, sprites, etc.)

### 5. User Experience (3 tests)
- Display favorites count badge
- Toggle button state between "Add" and "Remove/Favorited"

## Required Implementation

### HTML/UI Elements
- `.add-to-favorites-btn` - Button on Pokemon cards
- `.favorites-link` or `.favorites-btn` - Navigation element
- `.favorites-container` or `.favorites-section` - Favorites page/section
- `.favorite-card` - Individual favorite Pokemon cards
- `.remove-from-favorites-btn` - Remove button on favorites
- `.favorites-count` or `.badge` - Count badge display

### JavaScript Functions Needed
- `addToFavorites(pokemon)` - Add to localStorage
- `removeFromFavorites(pokemonId)` - Remove from localStorage
- `getFavorites()` - Retrieve all favorites
- `isFavorited(pokemonId)` - Check if already favorited
- `updateFavoritesUI()` - Render favorites list
- `updateFavoriteCount()` - Update badge count

### localStorage Structure
```javascript
// Key: 'pokemonFavorites'
// Value: Array of Pokemon objects
[
  {
    id: number,
    name: string,
    sprites: { front_default: string },
    weight: number,
    height: number,
    abilities: array
  }
]
```

## Test Execution
```bash
# Run E2E tests (requires dev server at localhost:1234)
npm run test:e2e

# Run all tests
npm run test:all
```

## Next Steps (Week 2 - GREEN Phase)
1. Create `src/js/favorites.js` module
2. Add UI elements to `src/partials/main.html`
3. Integrate favorites functionality into existing Pokemon cards
4. Build favorites page/section
5. Make all 18 tests pass ✅
