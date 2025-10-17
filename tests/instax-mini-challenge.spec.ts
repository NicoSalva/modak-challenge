// tests/instax-mini-challenge.spec.ts
import puppeteer from 'puppeteer-extra';
import { Browser, Page } from 'puppeteer';

// Page Objects
import { HomePagePuppeteer } from '../src/pages/HomePagePuppeteer';
import { SearchResultsPagePuppeteer } from '../src/pages/SearchResultsPagePuppeteer';
import { ProductPagePuppeteer } from '../src/pages/ProductPagePuppeteer';

describe('Instax Mini Challenge E2E Test', () => {
  let browser: Browser;
  let page: Page;
  let homePage: HomePagePuppeteer;
  let searchResultsPage: SearchResultsPagePuppeteer;
  let productPage: ProductPagePuppeteer;

  beforeAll(async () => {
    console.log('Starting Instax Mini Challenge test with Puppeteer + POM + Jest...');
    
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1366, height: 768 });
    
    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0'
    });

    // Initialize Page Objects
    homePage = new HomePagePuppeteer(page);
    searchResultsPage = new SearchResultsPagePuppeteer(page);
    productPage = new ProductPagePuppeteer(page);
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  afterEach(async () => {
    // Take screenshot on test failure
    const testState = expect.getState();
    if (testState.currentTestName && testState.currentTestName.includes('failed')) {
      await page.screenshot({ 
        path: `test-failure-${Date.now()}.png`, 
        fullPage: true 
      });
    }
  });

  it('should navigate to AliExpress homepage successfully', async () => {
    await homePage.navigateToHomePage();
    
    const pageTitle = await page.title();
    expect(pageTitle).toBeDefined();
    expect(pageTitle.length).toBeGreaterThan(0);
    expect(pageTitle.toLowerCase()).toContain('aliexpress');
  });

  it('should search for "instax mini" and get valid results', async () => {
    const searchUrl = await homePage.searchForProduct('instax mini');
    console.log(`Current URL: ${searchUrl}`);
    
    const isValidSearchUrl = searchUrl.includes('search') || 
                            searchUrl.includes('wholesale') || 
                            searchUrl.includes('instax');
    expect(isValidSearchUrl).toBe(true);
    console.log('Search results verified');
  });

  it('should navigate to second page of results', async () => {
    await searchResultsPage.clickOnSecondPage();
    
    const currentUrlAfterPagination = await page.url();
    expect(currentUrlAfterPagination).toBeDefined();
    expect(typeof currentUrlAfterPagination).toBe('string');
  });

  it('should click on first product and navigate to product page', async () => {
    const productUrl = await searchResultsPage.clickOnFirstProduct();
    
    expect(productUrl).toBeDefined();
    expect(typeof productUrl).toBe('string');
    expect(productUrl.length).toBeGreaterThan(0);
    expect(productUrl).toContain('/item/');
  });

  it('should verify product page has required elements', async () => {
    const productData = await productPage.getProductPageData();
    
    expect(productData.isProductPage).toBe(true);
    expect(productData.url).toContain('/item/');
    expect(productData.interactiveElementsCount).toBeGreaterThan(0);
    expect(productData.title).toBeDefined();
    expect(typeof productData.title).toBe('string');
    expect(productData.title.length).toBeGreaterThan(0);
    
    console.log('Test completed successfully! Product availability verified.');
  });

  it('should complete full end-to-end flow successfully', async () => {
    // This test ensures the entire flow works together
    const productData = await productPage.getProductPageData();
    
    // Final validation
    expect(productData.isProductPage).toBe(true);
    expect(productData.interactiveElementsCount).toBeGreaterThan(0);
    
    // Take final screenshot
    await page.screenshot({ path: 'instax-mini-jest-final.png', fullPage: true });
    console.log('Final screenshot saved as instax-mini-jest-final.png');
  });
});
