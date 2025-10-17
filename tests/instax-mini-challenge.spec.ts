import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { TestData } from '../testdata/TestData';

test.describe('AliExpress Challenge - Instax Mini Search', () => {
  test('should search for instax mini, go to second page, select item and verify availability', async ({ page }) => {
    
    // Initialize Page Objects
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    const productPage = new ProductPage(page);

    // Step 1: Navigate to AliExpress homepage
    await homePage.navigateToHomePage();
 
    // Step 2: Search for "instax mini"
    await homePage.searchForProduct(TestData.SEARCH_TERM);
    
    // Step 3: Verify search results
    await homePage.verifySearchResults(TestData.SEARCH_TERM);
    
    // Step 4: Go to second page
    await searchResultsPage.clickOnSecondPage();
    
    // Step 5: Click on first product
    await searchResultsPage.clickOnFirstProduct();
    
    // Step 6: Verify product availability
    const isAvailable = await productPage.verifyProductAvailability();
    
    // Final assertion
    expect(isAvailable).toBe(true);
    
    console.log('✅ Test completed successfully! Product availability verified.');
  });
});
