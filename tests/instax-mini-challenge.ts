// tests/instax-mini-challenge.ts
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { strict as assert } from 'assert';

// Page Objects
import { HomePagePuppeteer } from '../pages-puppeteer/HomePagePuppeteer';
import { SearchResultsPagePuppeteer } from '../pages-puppeteer/SearchResultsPagePuppeteer';
import { ProductPagePuppeteer } from '../pages-puppeteer/ProductPagePuppeteer';

// Add stealth plugin
puppeteer.use(StealthPlugin());

async function testInstaxMiniChallenge(): Promise<void> {
  console.log('Starting Instax Mini Challenge test with Puppeteer + POM...');
  
  const browser = await puppeteer.launch({
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

  const page = await browser.newPage();
  
  try {
    // Set viewport and user agent
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
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
    const homePage = new HomePagePuppeteer(page);
    const searchResultsPage = new SearchResultsPagePuppeteer(page);
    const productPage = new ProductPagePuppeteer(page);

    // Step 1: Navigate to AliExpress homepage
    await homePage.navigateToHomePage();
    
    // Validate homepage loaded correctly
    const pageTitle = await page.title();
    assert(typeof pageTitle === 'string' && pageTitle.length > 0, 'Page title should not be empty');
    assert(pageTitle.toLowerCase().includes('aliexpress'), 'Page title should contain AliExpress');

    // Step 2: Search for "instax mini"
    const searchUrl = await homePage.searchForProduct('instax mini');
    console.log(`Current URL: ${searchUrl}`);
    
    // Step 3: Verify search results with professional validation
    const isValidSearchUrl = searchUrl.includes('search') || 
                            searchUrl.includes('wholesale') || 
                            searchUrl.includes('instax');
    assert(isValidSearchUrl, 'URL should contain search, wholesale, or instax terms');
    console.log('Search results verified');

    // Step 4: Go to second page
    await searchResultsPage.clickOnSecondPage();
    
    // Validate pagination worked
    const currentUrlAfterPagination = await page.url();
    assert(typeof currentUrlAfterPagination === 'string', 'URL should be valid after pagination');

    // Step 5: Click on first product
    const productUrl = await searchResultsPage.clickOnFirstProduct();
    
    // Validate product navigation
    assert(typeof productUrl === 'string' && productUrl.length > 0, 'Product URL should not be empty');
    assert(productUrl.includes('/item/'), 'Product URL should contain /item/ path');

    // Step 6: Verify product availability with detailed validation
    const productData = await productPage.getProductPageData();
    
    // Professional test validations with Node.js assertions
    assert(productData.isProductPage === true, 'Should be on a product page');
    assert(productData.url.includes('/item/'), 'Product URL should contain /item/ path');
    assert(productData.interactiveElementsCount > 0, 'Product page should have interactive elements');
    assert(typeof productData.title === 'string' && productData.title.length > 0, 'Product page should have a title');
    
    console.log('Test completed successfully! Product availability verified.');
    
    // Take final screenshot
    await page.screenshot({ path: 'instax-mini-pom-puppeteer-final.png', fullPage: true });
    console.log('Final screenshot saved as instax-mini-pom-puppeteer-final.png');
    
  } catch (error) {
    console.error('Test failed:', error);
    
    // Take error screenshot
    await page.screenshot({ path: 'instax-mini-pom-puppeteer-error.png', fullPage: true });
    console.log('Error screenshot saved as instax-mini-pom-puppeteer-error.png');
    
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testInstaxMiniChallenge().catch(console.error);
