// tests/instax-mini-challenge.spec.ts
import puppeteer from 'puppeteer-extra';
import { Browser, Page } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Page Objects
import { HomePagePuppeteer } from '../src/pages/HomePagePuppeteer';
import { SearchResultsPagePuppeteer } from '../src/pages/SearchResultsPagePuppeteer';
import { ProductPagePuppeteer } from '../src/pages/ProductPagePuppeteer';

// Add stealth plugin
puppeteer.use(StealthPlugin());

describe('Instax Mini Challenge E2E Test', () => {
  let browser: Browser;
  let page: Page;
  let homePage: HomePagePuppeteer;
  let searchResultsPage: SearchResultsPagePuppeteer;
  let productPage: ProductPagePuppeteer;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    homePage = new HomePagePuppeteer(page);
    searchResultsPage = new SearchResultsPagePuppeteer(page);
    productPage = new ProductPagePuppeteer(page);
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
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
    
    expect(searchUrl).toBeTruthy();
    
    const isValidSearchUrl = searchUrl.includes('search') || 
                            searchUrl.includes('wholesale') || 
                            searchUrl.includes('instax');
    
    if (!isValidSearchUrl) {
      throw new Error(`Search URL does not contain expected keywords. URL: ${searchUrl}`);
    }
    
    expect(isValidSearchUrl).toBe(true);
  });

  it('should navigate to second page of results', async () => {
    await searchResultsPage.clickOnSecondPage();
    
    const currentUrlAfterPagination = await page.url();
    
    if (!currentUrlAfterPagination) {
      throw new Error('URL after pagination is undefined');
    }
    
    expect(currentUrlAfterPagination).toBeDefined();
    expect(typeof currentUrlAfterPagination).toBe('string');
  });

  it('should click on second product and navigate to product page', async () => {
    const productUrl = await searchResultsPage.clickOnSecondProduct();
    
    if (!productUrl) {
      throw new Error('Product URL is undefined');
    }
    
    if (!productUrl.includes('/item/')) {
      throw new Error(`Product URL does not contain /item/ path. URL: ${productUrl}`);
    }
    
    expect(productUrl).toBeDefined();
    expect(typeof productUrl).toBe('string');
    expect(productUrl.length).toBeGreaterThan(0);
    expect(productUrl).toContain('/item/');
  });

  it('should verify second product from page 2 has stock', async () => {
    const productData = await productPage.getProductPageData();
    
    if (!productData.isProductPage) {
      throw new Error(`Not on a product page. URL: ${productData.url}`);
    }
    
    if (productData.interactiveElementsCount === 0) {
      throw new Error('No interactive elements found on product page');
    }
    
    if (!productData.hasStock) {
      throw new Error(`Product does not have stock available. Product URL: ${productData.url}`);
    }
    
    expect(productData.isProductPage).toBe(true);
    expect(productData.interactiveElementsCount).toBeGreaterThan(0);
    expect(productData.hasStock).toBe(true);
  });
});
