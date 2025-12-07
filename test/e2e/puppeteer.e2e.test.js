const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,
    defaultViewport: { width: 1200, height: 900 },
  });
  //   const browser = await puppeteer.launch({
  //     headless: true,
  //     args: ["--no-sandbox"],
  //   });
  const page = await browser.newPage();

  await page.goto('https://annakompan.github.io/pokeApi/', {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('.card', { visible: true });

  // SEARCH TEST
  console.log('Testing Search');
  await page.focus('.poke-input');
  await page.keyboard.type('charizard', { delay: 80 });
  await page.keyboard.press('Enter');

  await page.waitForNetworkIdle({ idleTime: 500 });

  // const searchResult = await page.$$eval('.card', cards =>
  //   cards.map(c => c.textContent.trim().toLowerCase())
  // );
  const searchResult = await page.$$eval('.card', cards =>
    cards.map(c => {
      let t = c.textContent;
      t = t.replace(/\s+/g, ' ');
      t = t.replace('☆ add to favorites', '');
      return t.trim();
    })
  );

  console.log('Search results: ', searchResult);

  await page.$eval('.poke-input', el => (el.value = ''));
  await page.$eval('.poke-input', el => el.dispatchEvent(new Event('input')));

  // SORT TEST
  console.log('Testing Sorting A-Z');

  await page.select('.poke_sort', 'asc');
  await page.waitForNetworkIdle({ idleTime: 500 });

  const sortedAZ = await page.$$eval('.card', cards =>
    cards.map(c => {
      let t = c.textContent;
      t = t.replace(/\s+/g, ' ');
      t = t.replace('☆ add to favorites', '');
      return t.trim();
    })
  );

  console.log('Sorted A-Z', sortedAZ);

  await page.select('.poke_sort', '');

  console.log('Testing Sorting Z-A');
  await page.select('.poke_sort', 'desc');
  await page.waitForNetworkIdle({ idleTime: 500 });

  const sortedZA = await page.$$eval('.card', cards =>
    cards.map(c => {
      let t = c.textContent;
      t = t.replace(/\s+/g, ' ');
      t = t.replace('☆ add to favorites', '');
      return t.trim();
    })
  );

  console.log('Sorted Z-A', sortedZA);

  await page.select('.poke_sort', '');

  // FILTER BY TYPE
  console.log('Testing Filtering By Type');

  await page.select('.poke_filter', 'fire');
  await page.waitForNetworkIdle({ idleTime: 500 });

  const fireCards = await page.$$eval('.card', cards =>
    cards.map(c => {
      let t = c.textContent;
      t = t.replace(/\s+/g, ' ');
      t = t.replace('☆ add to favorites', '');
      return t.trim();
    })
  );

  console.log('Fire type pokemons: ', fireCards);

  await page.select('.poke_filter', 'all');

  // FILTER BY WEIGHT
  console.log('Testing Filter By Weight 300');

  await page.$eval('.poke_weights_range', el => (el.value = 300));
  await page.$eval('.poke_weights_range', el =>
    el.dispatchEvent(new Event('input'))
  );

  await page.waitForNetworkIdle({ idleTime: 500 });

  const weightResults = await page.$$eval('.card', cards =>
    cards.map(c => {
      let t = c.textContent;
      t = t.replace(/\s+/g, ' ');
      t = t.replace('☆ add to favorites', '');
      return t.trim();
    })
  );
  console.log('Pokemons with weight up to 300: ', weightResults);

  await page.$eval('.poke_weights_range', el => (el.value = 1000));
  await page.$eval('.poke_weights_range', el =>
    el.dispatchEvent(new Event('input'))
  );

  // FILTER BY HEIGHT

  console.log('Testing Filter By Height 10');

  await page.$eval('.poke_heights_range', el => (el.value = 30));
  await page.$eval('.poke_weights_range', el =>
    el.dispatchEvent(new Event('input'))
  );

  await page.waitForNetworkIdle({ idleTime: 500 });

  const heightResults = await page.$$eval('.card', cards =>
    cards.map(c => {
      let t = c.textContent;
      t = t.replace(/\s+/g, ' ');
      t = t.replace('☆ add to favorites', '');
      return t.trim();
    })
  );

  console.log('Pokemons with height up to 10: ', heightResults);
  await page.$eval('.poke_heights_range', el => (el.value = 900));
  await page.$eval('.poke_heights_range', el =>
    el.dispatchEvent(new Event('input'))
  );
  await page.waitForNetworkIdle({ idleTime: 500 });
  console.log('Puppeteer Testing Finished');
  await browser.close();
})();
