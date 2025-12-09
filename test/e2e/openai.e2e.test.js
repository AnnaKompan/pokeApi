const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100, // Slow down to see what's happening
        defaultViewport: { width: 1200, height: 900 },
    });

    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // Enable request interception to mock the OpenAI API
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.url().includes('/api/openai') && request.method() === 'POST') {
            console.log('Intercepted OpenAI API request');
            request.respond({
                status: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                contentType: 'application/json',
                body: JSON.stringify({
                    result: `
Pikachu: Pikachu is an electric type pokemon, providing energy for the task.
Charizard: Charizard can fly and use fire, making it versatile.
Squirtle: Squirtle is essential for cleaning tasks due to water abilities.
`,
                }),
            });
        } else if (request.url().includes('pokeapi.co/api/v2/pokemon/')) {
            request.respond({
                status: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                contentType: 'application/json',
                body: JSON.stringify({
                    sprites: {
                        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
                    }
                }),
            });
        } else {
            request.continue();
        }
    });

    try {
        console.log('Navigating to the application...');
        await page.goto('https://annakompan.github.io/pokeApi/', {
            waitUntil: 'networkidle2',
        });

        // 1. Open OpenAI Section
        console.log('Clicking "Ask ChatGPT" link...');
        // Ensure the link is visible and clickable
        await page.waitForSelector('.openai-link', { visible: true });
        await page.click('.openai-link');

        // 2. Wait for the OpenAI section to be visible
        console.log('Waiting for OpenAI section...');
        await page.waitForSelector('.openai-section', { visible: true });

        // 3. Enter a task
        const taskQuery = 'setup a party';
        console.log(`typing task: "${taskQuery}"...`);
        await page.waitForSelector('#aiinput', { visible: true });
        await page.focus('#aiinput');
        await page.keyboard.type(taskQuery, { delay: 100 });
        await page.keyboard.press('Enter');

        // 4. Wait for results processing (mocked response)
        console.log('Waiting for results...');
        // The code updates .openai-response-title and .openai-response
        // We expect a list of pokemons to appear.
        // The openai.js creates a ul.pokemon-list
        await page.waitForSelector('.pokemon-list', { visible: true, timeout: 10000 });

        // 5. Verify results
        const items = await page.$$eval('.pokemon-list li', lis =>
            lis.map(li => li.textContent.trim())
        );

        console.log('Received Pokemon recommendations:', items);

        const expectedNames = ['Pikachu', 'Charizard', 'Squirtle'];
        const allFound = expectedNames.every(name =>
            items.some(item => item.includes(name))
        );

        if (allFound && items.length === 3) {
            console.log('SUCCESS: All expected pokemons are displayed correctly.');
        } else {
            console.error('FAILURE: Discrepancy in results.', items);
            process.exit(1);
        }
    } catch (error) {
        console.error('Test failed with error:', error);
        process.exit(1);
    } finally {
        console.log('Closing browser...');
        await browser.close();
    }
})();
