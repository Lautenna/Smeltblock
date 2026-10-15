// Ouvre Chromium sur le site avec l'auth HTTP + Inspector (bouton "Pick locator").
// Usage : npm run codegen [-- /chemin]   (ex. npm run codegen -- /vote)
const { chromium } = require('@playwright/test');

// Mêmes valeurs que `use` dans playwright.config.js
const baseURL = 'https://azure-pelican-926599.hostingersite.com/';
const httpCredentials = { username: 'laura', password: 'playwright' };

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ baseURL, httpCredentials });
  const page = await context.newPage();
  await page.goto(process.argv[2] || '/');
  await page.pause(); // ouvre l'Inspector ; ferme-le pour quitter
  await browser.close();
})();
