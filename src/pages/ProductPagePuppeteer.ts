// pages-puppeteer/ProductPagePuppeteer.ts
import { Page } from 'puppeteer';

export class ProductPagePuppeteer {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getProductLinks(): Promise<number> {
    // Get count of interactive elements on product page
    const productElements = await this.page.$$('a, button, input');
    return productElements.length;
  }

  async isProductPageLoaded(): Promise<boolean> {
    // Check if we're on a product page
    const url = this.page.url();
    return url.includes('/item/') || url.includes('/product/');
  }

  async getProductPageData(): Promise<{
    url: string;
    isProductPage: boolean;
    interactiveElementsCount: number;
    title: string;
  }> {
    console.log('Gathering product page data...');
    
    const productUrl = this.page.url();
    const title = await this.page.title();
    const isProductPage = await this.isProductPageLoaded();
    const interactiveElementsCount = await this.getProductLinks();
    
    console.log(`Product URL: ${productUrl}`);
    console.log(`Found ${interactiveElementsCount} interactive elements on product page`);
    
    return {
      url: productUrl,
      isProductPage,
      interactiveElementsCount,
      title
    };
  }

  async verifyProductAvailability(): Promise<boolean> {
    const data = await this.getProductPageData();
    
    if (data.isProductPage && data.interactiveElementsCount > 0) {
      console.log('Product page has interactive elements - verification successful!');
      return true;
    } else {
      console.log('Product page verification failed');
      return false;
    }
  }
}
