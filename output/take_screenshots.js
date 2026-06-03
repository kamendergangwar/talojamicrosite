const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const filePath = 'file://' + path.resolve('index.html');

  // Desktop 1280
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(filePath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Section 2 screenshot
  const aboutEl = await page.$('#about');
  if (aboutEl) {
    await aboutEl.screenshot({ path: 'output/cidco-section2-about.png' });
    console.log('Captured cidco-section2-about.png');
  }

  // Section 3 (why-top only) screenshot
  const whyTopEl = await page.$('.why-top');
  if (whyTopEl) {
    await whyTopEl.screenshot({ path: 'output/cidco-section3-why.png' });
    console.log('Captured cidco-section3-why.png');
  }

  // Mobile 768
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(filePath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const aboutMob = await page.$('#about');
  if (aboutMob) {
    await aboutMob.screenshot({ path: 'output/cidco-section2-mobile.png' });
    console.log('Captured cidco-section2-mobile.png');
  }

  const whyMob = await page.$('.why-top');
  if (whyMob) {
    await whyMob.screenshot({ path: 'output/cidco-section3-mobile.png' });
    console.log('Captured cidco-section3-mobile.png');
  }

  await browser.close();
})();
