// tests/setup.ts
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Add stealth plugin globally
puppeteer.use(StealthPlugin());

