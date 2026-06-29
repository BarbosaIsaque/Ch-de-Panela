const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await b.pages();
  const page = pages.find(p => p.url().includes('abacate')) || pages[0];
  // achar input de descrição
  const inp = await page.$('input[placeholder="Digite a descrição"], textarea[placeholder="Digite a descrição"]');
  if (inp) { await inp.click(); await inp.type('Cha de panela - PIX v1'); }
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: '/tmp/abacate.png' });
  console.log('desc preenchida:', !!inp);
  b.disconnect();
})();
