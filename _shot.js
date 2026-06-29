const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await b.pages();
  const page = pages.find(p => p.url().includes('abacate')) || pages[0];
  await new Promise(r => setTimeout(r, 1500));
  console.log('URL:', page.url());
  console.log('TITLE:', await page.title());
  await page.screenshot({ path: '/tmp/abacate.png' });
  b.disconnect();
})();
