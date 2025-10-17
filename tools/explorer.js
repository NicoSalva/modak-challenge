const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Selector Explorer Tool
 * 
 * Launches a persistent Chrome browser for manual exploration of AliExpress
 * to extract stable selectors without triggering bot protection.
 */

class SelectorExplorer {
  async launch() {
    console.log('🚀 Launching Selector Explorer...');
    
    // Create persistent context with anti-automation tweaks
    this.browser = await chromium.launch({
      headless: false,
      channel: 'chrome',
      args: [
        '--disable-blink-features=AutomationControlled',
        '--exclude-switches=enable-automation',
        '--disable-extensions-except',
        '--disable-plugins-except',
      ]
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1366, height: 768 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      extraHTTPHeaders: {
        'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
      },
    });

    // Apply anti-automation scripts
    await this.context.addInitScript(() => {
      // Override navigator.webdriver
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });

      // Provide realistic navigator properties
      Object.defineProperty(navigator, 'languages', {
        get: () => ['es-AR', 'es', 'en'],
      });

      Object.defineProperty(navigator, 'plugins', {
        get: () => [
          { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
          { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
          { name: 'Native Client', filename: 'internal-nacl-plugin' },
        ],
      });

      // Override chrome runtime
      if (!window.chrome) {
        window.chrome = {};
      }
      if (!window.chrome.runtime) {
        window.chrome.runtime = {
          onConnect: undefined,
          onMessage: undefined,
        };
      }
    });

    this.page = await this.context.newPage();
    
    // Navigate to AliExpress
    const baseUrl = process.env.BASE_URL || 'https://www.aliexpress.com';
    console.log(`📍 Navigating to: ${baseUrl}`);
    
    await this.page.goto(baseUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    console.log('✅ Browser launched successfully!');
    console.log('💡 Browse manually, then press ENTER in terminal to dump selectors');
  }

  async waitForUserInput() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question('Press ENTER to dump selectors (or Ctrl+C to exit): ', () => {
        rl.close();
        resolve();
      });
    });
  }

  async dumpSelectors() {
    console.log('🔍 Collecting selectors...');

    const selectors = [];

    try {
      // Collect search input candidates
      const searchSelectors = [
        'input[type="search"]',
        'input[name*="search"]',
        'input[placeholder*="Search"]',
        'input[placeholder*="Buscar"]',
        'input[aria-label*="search"]',
        'input[aria-label*="buscar"]',
        'input[id*="search"]',
        'input[class*="search"]',
        '#search-words',
        'input'
      ];

      for (const selector of searchSelectors) {
        try {
          const element = this.page.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            const outerHTML = await element.evaluate((el) => el.outerHTML);
            const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
            const attributes = await element.evaluate((el) => {
              const attrs = {};
              for (const attr of el.attributes) {
                attrs[attr.name] = attr.value;
              }
              return attrs;
            });

            selectors.push({
              selector,
              outerHTML,
              tagName,
              attributes
            });
            console.log(`✅ Found: ${selector}`);
            break; // Only take the first matching search input
          }
        } catch (error) {
          // Continue to next selector
        }
      }

      // Collect first anchor link
      try {
        const anchor = this.page.locator('a[href]').first();
        if (await anchor.isVisible({ timeout: 1000 })) {
          const outerHTML = await anchor.evaluate((el) => el.outerHTML);
          const tagName = await anchor.evaluate((el) => el.tagName.toLowerCase());
          const attributes = await anchor.evaluate((el) => {
            const attrs = {};
            for (const attr of el.attributes) {
              attrs[attr.name] = attr.value;
            }
            return attrs;
          });

          selectors.push({
            selector: 'a[href]',
            outerHTML,
            tagName,
            attributes
          });
          console.log('✅ Found: a[href]');
        }
      } catch (error) {
        console.log('⚠️ No anchor links found');
      }

      // Collect button candidates
      const buttonSelectors = [
        'button[type="submit"]',
        'button:has-text("Search")',
        'button:has-text("Buscar")',
        'button[class*="search"]',
        'button[class*="submit"]',
        'button'
      ];

      for (const selector of buttonSelectors) {
        try {
          const element = this.page.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            const outerHTML = await element.evaluate((el) => el.outerHTML);
            const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
            const attributes = await element.evaluate((el) => {
              const attrs = {};
              for (const attr of el.attributes) {
                attrs[attr.name] = attr.value;
              }
              return attrs;
            });

            selectors.push({
              selector,
              outerHTML,
              tagName,
              attributes
            });
            console.log(`✅ Found: ${selector}`);
            break; // Only take the first matching button
          }
        } catch (error) {
          // Continue to next selector
        }
      }

      // Write to JSON file
      const outputPath = path.join(process.cwd(), 'explorer-dump.json');
      fs.writeFileSync(outputPath, JSON.stringify(selectors, null, 2));
      
      console.log(`📄 Dumped ${selectors.length} selectors to: ${outputPath}`);
      
      // Show summary
      console.log('\n📊 Summary:');
      selectors.forEach((item, index) => {
        console.log(`${index + 1}. ${item.selector} (${item.tagName})`);
      });

    } catch (error) {
      console.error('❌ Error collecting selectors:', error);
      throw error;
    }
  }

  async keepOpen(seconds = 60) {
    console.log(`⏰ Keeping browser open for ${seconds} seconds...`);
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  async close() {
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
    console.log('👋 Browser closed');
  }
}

async function main() {
  const explorer = new SelectorExplorer();
  
  try {
    await explorer.launch();
    await explorer.waitForUserInput();
    await explorer.dumpSelectors();
    await explorer.keepOpen(30); // Keep open for 30 seconds
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await explorer.close();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SelectorExplorer };
