const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
  const pages = await b.pages();
  const page = pages.find(p => p.url().includes('abacate')) || pages[0];
  // listar links do menu lateral
  const links = await page.$$eval('a[href]', as => as.map(a => ({t:(a.textContent||'').trim(), h:a.getAttribute('href')})).filter(x=>x.h && x.h.startsWith('/')));
  console.log(JSON.stringify([...new Map(links.map(l=>[l.h,l])).values()], null, 0));
  b.disconnect();
})();
