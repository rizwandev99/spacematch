const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Intercept network requests
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().includes('/api/chat') && request.method() === 'POST') {
      console.log('API PAYLOAD:', request.postData());
    }
    request.continue();
  });
  
  await page.goto('http://localhost:3000');
  
  // Wait for input to be ready
  await page.waitForSelector('input[type="text"]');
  await page.type('input[type="text"]', 'I need an office');
  await page.keyboard.press('Enter');
  
  // wait 2 seconds for request
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
