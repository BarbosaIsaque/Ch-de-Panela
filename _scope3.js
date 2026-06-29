const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await b.pages();
  const page = pages.find(p => p.url().includes('abacate')) || pages[0];
  const clickText = async (label) => page.evaluate((label) => {
    const els = [...document.querySelectorAll('*')].filter(e => e.childElementCount===0 && (e.textContent||'').trim()===label);
    if (els.length) { els[els.length-1].click(); return true; } return false;
  }, label);
  console.log('escopo:', await clickText('Leitura e escrita'));
  await new Promise(r => setTimeout(r, 800));
  // abrir permissões
  console.log('perm:', await clickText('Selecione uma opção'));
  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: '/tmp/abacate.png' });
  b.disconnect();
})();
