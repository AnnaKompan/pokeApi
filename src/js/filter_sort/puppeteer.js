const puppeteer = require('puppeteer');

(async () => {
  //   Launch the browser and open a new blank page
  // const browser = await puppeteer.launch();
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

  // Go to the page
  await page.goto('https://annakompan.github.io/pokeApi/', {
    waitUntil: 'networkidle2',
  });

  await page.setViewport({ width: 1080, height: 1024 });
  await page.waitForSelector('.card', { visible: true });

  // Hints:
  await page.waitForSelector('.poke-input', { visible: true });

  await page.click('.poke_sort');

  //   const searchInput = await page.$('.poke-input');
  //   await searchInput.type('charizard', { delay: 80 });

  //   // Wait for search result
  //   await page.waitForSelector(".DocSearch-Dropdown", { visible: true });

  //   // Get the `Docs` result section
  //   await page.waitForFunction(
  //     () => {
  //       const dropdown = document.querySelector(".DocSearch-Dropdown");
  //       if (!dropdown) return false;
  //       const sections = Array.from(
  //         dropdown.querySelectorAll("section.DocSearch-Hits")
  //       );
  //       return sections.some(
  //         (section) =>
  //           section.querySelector(".DocSearch-Hit-source")?.textContent.trim() ===
  //           "Docs"
  //       );
  //     },
  //     { timeout: 10000 }
  //   );

  //   // Click on first result in `Docs` section
  //   const firstDocsUrl = await page.evaluate(() => {
  //     const dropdown = document.querySelector(".DocSearch-Dropdown");
  //     if (!dropdown) return null;

  //     const docsSection = Array.from(
  //       dropdown.querySelectorAll("section.DocSearch-Hits")
  //     ).find(
  //       (sec) =>
  //         sec.querySelector(".DocSearch-Hit-source")?.textContent.trim() ===
  //         "Docs"
  //     );

  //     return docsSection?.querySelector("a")?.href || null;
  //   });

  //   // Locate the title
  //   await page.goto(firstDocsUrl, {
  //     waitUntil: "networkidle2",
  //     timeout: 60000,
  //   });
  //   await page.waitForSelector(
  //     "#puppeteer-features-fully-supported-over-webdriver-bidi",
  //     { visible: true, timeout: 20000 }
  //   );
  //   const titleText = await page.$eval(
  //     "#puppeteer-features-fully-supported-over-webdriver-bidi",
  //     (el) => el.textContent.trim().replace(/\u200B/g, "")
  //   );
  //   const cleanText = titleText.normalize("NFKC");

  //   // Print the title
  //   console.log(cleanText);

  //   //   Close the browser
  //   await browser.close();
})();

// const puppeteer = require("puppeteer");

// (async () => {
//   // Launch the browser and open a new blank page
//   //   const browser = await puppeteer.launch();
//   //   const browser = await puppeteer.launch({
//   //     headless: false,
//   //     slowMo: 80,
//   //     defaultViewport: { width: 1200, height: 900 },
//   //   });
//   const browser = await puppeteer.launch({
//     headless: true,
//     args: ["--no-sandbox"],
//   });
//   const page = await browser.newPage();

//   // Go to the page
//   await page.goto("https://pptr.dev", { waitUntil: "networkidle2" });
//   //   await page.setViewport({ width: 1080, height: 1024 });
//   await page.waitForSelector("header", { visible: true });

//   // Hints:
//   // Click search button
//   await page.keyboard.press("/");
//   await page.waitForSelector(".DocSearch-Input", { visible: true });

//   // Type into search box
//   const searchInput = await page.$(".DocSearch-Input");
//   await searchInput.type("chipi chipi chapa chapa", { delay: 50 });

//   // Wait for search result
//   await page.waitForSelector(".DocSearch-Dropdown", { visible: true });

//   // Get the `Docs` result section
//   await page.waitForFunction(
//     () => {
//       const dropdown = document.querySelector(".DocSearch-Dropdown");
//       if (!dropdown) return false;
//       const sections = Array.from(
//         dropdown.querySelectorAll("section.DocSearch-Hits")
//       );
//       return sections.some(
//         (section) =>
//           section.querySelector(".DocSearch-Hit-source")?.textContent.trim() ===
//           "Docs"
//       );
//     },
//     { timeout: 10000 }
//   );

//   // Click on first result in `Docs` section
//   const firstDocsUrl = await page.evaluate(() => {
//     const dropdown = document.querySelector(".DocSearch-Dropdown");
//     if (!dropdown) return null;

//     const docsSection = Array.from(
//       dropdown.querySelectorAll("section.DocSearch-Hits")
//     ).find(
//       (sec) =>
//         sec.querySelector(".DocSearch-Hit-source")?.textContent.trim() ===
//         "Docs"
//     );

//     return docsSection?.querySelector("a")?.href || null;
//   });

//   // Locate the title
//   await page.goto(firstDocsUrl, {
//     waitUntil: "networkidle2",
//     timeout: 60000,
//   });
//   await page.waitForSelector(
//     "#puppeteer-features-fully-supported-over-webdriver-bidi",
//     { visible: true, timeout: 20000 }
//   );
//   const titleText = await page.$eval(
//     "#puppeteer-features-fully-supported-over-webdriver-bidi",
//     (el) => el.textContent.trim().replace(/\u200B/g, "")
//   );
//   const cleanText = titleText.normalize("NFKC");

//   // Print the title
//   console.log(cleanText);

//   //   Close the browser
//   await browser.close();
// })();
