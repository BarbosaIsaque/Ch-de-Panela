const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await b.pages();
  const page = pages.find(p => p.url().includes('abacate')) || pages[0];
  const pick = async (label) => {
    const els = await page.$$('*');
    for (const el of els) {
      const t = (await page.evaluate(e => e.childElementCount===0 ? (e.textContent||'').trim() : '', el));
      if (t === label) { await el.click(); return true; }
    }
    return false;
  };
  console.log('escopo:', await pick('Leitura e escrita'));
  await new Promise(r => setTimeout(r, 700));
  // abrir permissões
  console.log('perm dropdown:', await pick('Selecione uma opção'));
  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: '/tmp/abacate.png' });
  const txt = await page.evaluate(() => document.body.innerText);
  console.log('---', txt.split('\n').slice(-25).join('\n'));
  b.disconnect();
})();
