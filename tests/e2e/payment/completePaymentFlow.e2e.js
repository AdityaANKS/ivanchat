const puppeteer = require('puppeteer');
const { startTestServer, stopTestServer } = require('../../helpers/testServer');
const { createTestUser, loginUser } = require('../../helpers/authHelper');
const { simulateUPIPayment } = require('../../helpers/webhookSimulator');

describe('Complete Payment Flow E2E', () => {
  let browser;
  let page;
  let serverUrl;
  let testUser;

  beforeAll(async () => {
    // Start test server
    serverUrl = await startTestServer();
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: process.env.HEADLESS !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Create test user
    testUser = await createTestUser();
  });

  afterAll(async () => {
    await browser.close();
    await stopTestServer();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(serverUrl);
  });

  afterEach(async () => {
    await page.close();
  });

  it('should complete payment flow from plan selection to activation', async () => {
    // Step 1: Login
    await loginUser(page, testUser.email, testUser.password);
    await page.waitForSelector('[data-testid="dashboard"]');

    // Step 2: Navigate to pricing page
    await page.click('[data-testid="upgrade-button"]');
    await page.waitForSelector('[data-testid="pricing-plans"]');

    // Step 3: Select monthly plan
    await page.click('[data-testid="plan-monthly"]');
    await page.waitForSelector('[data-testid="payment-page"]');

    // Step 4: Verify QR code is displayed
    const qrCode = await page.$('[data-testid="qr-code"]');
    expect(qrCode).toBeTruthy();

    // Step 5: Get transaction reference
    const transactionRef = await page.$eval(
      '[data-testid="transaction-ref"]',
      el => el.textContent
    );
    expect(transactionRef).toMatch(/^[A-Z0-9-]+$/);

    // Step 6: Simulate UPI payment
    await simulateUPIPayment({
      transactionRef,
      amount: 99,
      status: 'success'
    });

    // Step 7: Wait for payment confirmation
    await page.waitForSelector('[data-testid="payment-success"]', {
      timeout: 10000
    });

    // Step 8: Verify membership activated
    const membershipBadge = await page.$('[data-testid="premium-badge"]');
    expect(membershipBadge).toBeTruthy();

    // Step 9: Verify redirect to dashboard
    await page.waitForSelector('[data-testid="dashboard"]');
    const url = page.url();
    expect(url).toContain('/dashboard');

    // Step 10: Verify membership features enabled
    const premiumFeatures = await page.$$('[data-testid="premium-feature"]');
    expect(premiumFeatures.length).toBeGreaterThan(0);
  }, 30000);

  it('should handle payment timeout gracefully', async () => {
    // Login and navigate to payment
    await loginUser(page, testUser.email, testUser.password);
    await page.click('[data-testid="upgrade-button"]');
    await page.click('[data-testid="plan-yearly"]');
    
    // Wait for QR code
    await page.waitForSelector('[data-testid="qr-code"]');

    // Fast forward time to expire payment
    await page.evaluate(() => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 31);
      Date.now = () => now.getTime();
    });

    // Wait for expiry message
    await page.waitForSelector('[data-testid="payment-expired"]', {
      timeout: 35000
    });

    // Verify retry button available
    const retryButton = await page.$('[data-testid="retry-payment"]');
    expect(retryButton).toBeTruthy();

    // Click retry and verify new QR generated
    await page.click('[data-testid="retry-payment"]');
    await page.waitForSelector('[data-testid="qr-code"]');
    
    const newTransactionRef = await page.$eval(
      '[data-testid="transaction-ref"]',
      el => el.textContent
    );
    expect(newTransactionRef).toBeTruthy();
  }, 40000);

  it('should show payment history after successful payment', async () => {
    // Login
    await loginUser(page, testUser.email, testUser.password);

    // Navigate to payment history
    await page.click('[data-testid="profile-menu"]');
    await page.click('[data-testid="payment-history"]');
    await page.waitForSelector('[data-testid="payment-history-table"]');

    // Verify payment records
    const payments = await page.$$('[data-testid="payment-row"]');
    expect(payments.length).toBeGreaterThan(0);

    // Verify download invoice button
    const invoiceButton = await page.$('[data-testid="download-invoice"]');
    expect(invoiceButton).toBeTruthy();
  });
});