const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await b.pages();
  const page = pages.find(p => p.url().includes('abacate')) || pages[0];
  // achar o dropdown "Selecione o escopo"
  const els = await page.$$('*');
  for (const el of els) {
    const t = (await page.evaluate(e => e.childElementCount===0 ? (e.textContent||'').trim() : '', el));
    if (t === 'Selecione o escopo') { await el.click(); break; }
  }
  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: '/tmp/abacate.png' });
  const txt = await page.evaluate(() => document.body.innerText);
  console.log(txt);
  b.disconnect();
})();
