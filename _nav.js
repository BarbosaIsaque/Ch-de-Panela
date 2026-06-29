const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await b.pages();
  const page = pages.find(p => p.url().includes('abacate')) || pages[0];
  console.log('URL atual:', page.url());
  await page.screenshot({ path: '/tmp/abacate.png' });
  b.disconnect();
})();
