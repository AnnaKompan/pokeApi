const fs = require('fs');
const path = require('path');

// Load the HTML file content
const html = fs.readFileSync(path.resolve(__dirname, '../partials/main.html'), 'utf8');

describe('main.html', () => {
  beforeEach(() => {
    // Set up the DOM
    document.body.innerHTML = html;
  });

  test('should limit the user input to 250 characters for the "best for task" pokemon', () => {
    const inputElement = document.getElementById('aiinput');
    expect(inputElement.getAttribute('maxlength')).toBe('250');
  });
});
