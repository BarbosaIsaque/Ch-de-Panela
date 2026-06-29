const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await b.pages();
  const page = pages.find(p => p.url().includes('abacate')) || pages[0];
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.textContent||'').trim()==='Continuar');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: '/tmp/abacate.png', fullPage: true });
  const txt = await page.evaluate(() => document.body.innerText);
  console.log(txt.slice(0,1200));
  b.disconnect();
})();
