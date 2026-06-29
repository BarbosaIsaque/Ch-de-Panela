const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await b.pages();
  const page = pages.find(p => p.url().includes('abacate')) || pages[0];
  // clicar no botão Nova chave
  const btns = await page.$$('button');
  for (const btn of btns) {
    const t = (await page.evaluate(el => el.textContent, btn) || '').trim();
    if (t.includes('Nova chave')) { await btn.click(); break; }
  }
  await new Promise(r => setTimeout(r, 1800));
  await page.screenshot({ path: '/tmp/abacate.png', fullPage: true });
  b.disconnect();
})();
