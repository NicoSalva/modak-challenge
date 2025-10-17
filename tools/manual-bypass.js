// tools/manual-bypass.js
const { chromium } = require('playwright');

async function manualBypass() {
  console.log('🚀 Starting manual bypass tool...');
  
  // Create persistent context
  const browser = await chromium.launchPersistentContext('./.pw-user', {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1366, height: 768 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Buenos_Aires',
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
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
    }
  });

  // Add anti-bot scripts
  await browser.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });

    if (!window.chrome) {
      window.chrome = {};
    }
    if (!window.chrome.runtime) {
      window.chrome.runtime = {
        onConnect: undefined,
        onMessage: undefined,
      };
    }

    Object.defineProperty(navigator, 'languages', {
      get: () => ['es-AR', 'es', 'en'],
    });

    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });

    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) => (
      parameters.name === 'notifications'
        ? Promise.resolve({ state: NotificationPermission.DENIED })
        : originalQuery(parameters)
    );
  });

  const page = await browser.newPage();

  try {
    console.log('🌐 Navigating to AliExpress...');
    await page.goto('https://www.aliexpress.com', { waitUntil: 'domcontentloaded' });
    
    console.log('⏳ Waiting for page to load...');
    await page.waitForTimeout(3000);
    
    const title = await page.title();
    console.log(`📄 Current page title: ${title}`);
    
    if (title.toLowerCase().includes('captcha') || 
        title.toLowerCase().includes('interception') ||
        title.toLowerCase().includes('verify')) {
      
      console.log('🤖 Bot detection detected!');
      console.log('📋 Instructions:');
      console.log('1. Look for a checkbox or switch that says "I am not a robot" or similar');
      console.log('2. Click on it first');
      console.log('3. Then look for a "Continue" or "Continue to AliExpress" button/link');
      console.log('4. Click on it');
      console.log('5. Wait for the redirect to complete');
      console.log('');
      console.log('⏳ Browser will stay open for 60 seconds for manual interaction...');
      
      // Wait 60 seconds for manual interaction
      await page.waitForTimeout(60000);
      
      const finalTitle = await page.title();
      console.log(`📄 Final page title: ${finalTitle}`);
      
      if (finalTitle.toLowerCase().includes('aliexpress')) {
        console.log('✅ Success! Bot detection bypassed manually!');
        
        // Save the session state
        const cookies = await page.context().cookies();
        const localStorage = await page.evaluate(() => JSON.stringify(localStorage));
        const sessionStorage = await page.evaluate(() => JSON.stringify(sessionStorage));
        
        console.log('💾 Session data saved for future use');
        console.log(`🍪 Cookies: ${cookies.length} items`);
        console.log(`💾 LocalStorage: ${localStorage.length} characters`);
        console.log(`💾 SessionStorage: ${sessionStorage.length} characters`);
        
      } else {
        console.log('❌ Still blocked. Try different approach.');
      }
      
    } else {
      console.log('✅ No bot detection found! You can proceed normally.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('🔒 Closing browser in 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

manualBypass().catch(console.error);
