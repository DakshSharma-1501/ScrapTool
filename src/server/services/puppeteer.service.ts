import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export async function fetchRenderedHtml(url: string, timeoutMs: number = 15000): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true, // using new headless behaves better usually, but sticking to true works
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    
    // Abort unnecessary resources to optimize speed
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: timeoutMs });
    const html = await page.content();
    return html;
  } catch (error) {
    console.error(`Puppeteer error for ${url}:`, error);
    throw new Error('Failed to fetch page securely via Headless Browser.');
  } finally {
    await browser.close();
  }
}
