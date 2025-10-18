// pages-puppeteer/ProductPagePuppeteer.ts
import { Page } from 'puppeteer';

export class ProductPage {
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

  async checkProductStock(): Promise<boolean> {
    // Check if product has stock by looking for buy/add to cart buttons
    const stockIndicators = [
      'button[class*="add-to-cart"]',
      'button[class*="buy-now"]',
      'button:contains("Add to Cart")',
      'button:contains("Buy Now")',
      'button:contains("Comprar")',
      'button:contains("Agregar al carrito")',
      '[class*="quantity"] input',
      '[class*="stock"]'
    ];

    for (const selector of stockIndicators) {
      try {
        if (selector.includes('contains')) {
          // Use evaluate for text-based selectors
          const found = await this.page.evaluate((text) => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.some(btn => btn.textContent?.includes(text));
          }, selector.split('"')[1]);
          if (found) return true;
        } else {
          // Use regular CSS selector
          const element = await this.page.$(selector);
          if (element && await element.isVisible()) {
            return true;
          }
        }
      } catch (error) {
        continue;
      }
    }
    return false;
  }

  async getProductPageData(): Promise<{
    url: string;
    isProductPage: boolean;
    interactiveElementsCount: number;
    title: string;
    hasStock: boolean;
  }> {
    const productUrl = this.page.url();
    const title = await this.page.title();
    const isProductPage = await this.isProductPageLoaded();
    const interactiveElementsCount = await this.getProductLinks();
    const hasStock = await this.checkProductStock();
    
    return {
      url: productUrl,
      isProductPage,
      interactiveElementsCount,
      title,
      hasStock
    };
  }

  async verifyProductAvailability(): Promise<boolean> {
    const data = await this.getProductPageData();
    
    if (data.isProductPage && data.interactiveElementsCount > 0) {
      return true;
    } else {
      return false;
    }
  }
}
