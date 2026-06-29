const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await b.pages();
  const page = pages.find(p => p.url().includes('abacate')) || pages[0];
  await page.goto('https://app.abacatepay.com/api', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  console.log('URL:', page.url());
  await page.screenshot({ path: '/tmp/abacate.png', fullPage: true });
  b.disconnect();
})();
