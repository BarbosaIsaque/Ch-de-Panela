const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await b.pages();
  const page = pages.find(p => p.url().includes('abacate')) || pages[0];
  // clicar na aba API v1
  const els = await page.$$('*');
  for (const el of els) {
    const t = (await page.evaluate(e => e.childElementCount===0 ? (e.textContent||'').trim() : '', el));
    if (t === 'API v1') { await el.click(); break; }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/tmp/abacate.png' });
  // texto do modal
  const txt = await page.evaluate(() => document.body.innerText);
  console.log(txt.split('\n').filter(l=>/v1|escopo|permiss|pix/i.test(l)).slice(0,10).join('\n'));
  b.disconnect();
})();
