const request = require('supertest');
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const app = require('../../server/src/app');
const { connectDB, clearDB, closeDB } = require('../helpers/db');
const { generateTestUser, generateTestServer } = require('../helpers/generators');

describe('E2E: Authentication Flow', () => {
  let browser;
  let page;
  let server;
  const baseURL = process.env.TEST_URL || 'http://localhost:3000';

  before(async () => {
    await connectDB();
    server = app.listen(3000);
    browser = await puppeteer.launch({
      headless: process.env.CI === 'true',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  beforeEach(async () => {
    await clearDB();
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
  });

  afterEach(async () => {
    await page.close();
  });

  after(async () => {
    await browser.close();
    server.close();
    await closeDB();
  });

  describe('User Registration', () => {
    it('should successfully register a new user', async () => {
      // Navigate to registration page
      await page.goto(`${baseURL}/register`);
      
      // Fill registration form
      await page.type('#username', 'testuser123');
      await page.type('#email', 'test@example.com');
      await page.type('#password', 'SecurePass123!');
      await page.type('#confirmPassword', 'SecurePass123!');
      
      // Submit form
      await page.click('#register-button');
      
      // Wait for navigation
      await page.waitForNavigation();
      
      // Check if redirected to dashboard
      expect(page.url()).to.include('/dashboard');
      
      // Check for welcome message
      const welcomeText = await page.$eval('.welcome-message', el => el.textContent);
      expect(welcomeText).to.include('Welcome, testuser123');
    });

    it('should show validation errors for invalid input', async () => {
      await page.goto(`${baseURL}/register`);
      
      // Submit empty form
      await page.click('#register-button');
      
      // Check for validation messages
      const errors = await page.$$eval('.error-message', elements => 
        elements.map(el => el.textContent)
      );
      
      expect(errors).to.include.members([
        'Username is required',
        'Email is required',
        'Password is required'
      ]);
    });

    it('should prevent duplicate email registration', async () => {
      // Create existing user
      const existingUser = await generateTestUser();
      
      await page.goto(`${baseURL}/register`);
      
      // Try to register with same email
      await page.type('#username', 'newuser');
      await page.type('#email', existingUser.email);
      await page.type('#password', 'SecurePass123!');
      await page.type('#confirmPassword', 'SecurePass123!');
      
      await page.click('#register-button');
      
      // Check for error message
      await page.waitForSelector('.error-message');
      const errorText = await page.$eval('.error-message', el => el.textContent);
      expect(errorText).to.include('Email already exists');
    });
  });

  describe('User Login', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await generateTestUser({
        password: 'TestPass123!'
      });
    });

    it('should successfully login with valid credentials', async () => {
      await page.goto(`${baseURL}/login`);
      
      // Enter credentials
      await page.type('#email', testUser.email);
      await page.type('#password', 'TestPass123!');
      
      // Submit login
      await page.click('#login-button');
      
      // Wait for redirect
      await page.waitForNavigation();
      
      // Verify logged in state
      expect(page.url()).to.include('/dashboard');
      
      // Check for user avatar in header
      await page.waitForSelector('.user-avatar');
      const username = await page.$eval('.username-display', el => el.textContent);
      expect(username).to.equal(testUser.username);
    });

    it('should show error for invalid credentials', async () => {
      await page.goto(`${baseURL}/login`);
      
      await page.type('#email', testUser.email);
      await page.type('#password', 'WrongPassword');
      
      await page.click('#login-button');
      
      // Wait for error message
      await page.waitForSelector('.error-message');
      const errorText = await page.$eval('.error-message', el => el.textContent);
      expect(errorText).to.include('Invalid credentials');
    });

    it('should remember user with "Remember Me" option', async () => {
      await page.goto(`${baseURL}/login`);
      
      await page.type('#email', testUser.email);
      await page.type('#password', 'TestPass123!');
      await page.click('#remember-me');
      
      await page.click('#login-button');
      await page.waitForNavigation();
      
      // Get cookies
      const cookies = await page.cookies();
      const sessionCookie = cookies.find(c => c.name === 'session');
      
      // Check cookie expiry (should be extended)
      expect(sessionCookie).to.exist;
      expect(sessionCookie.expires).to.be.greaterThan(Date.now() / 1000 + 86400);
    });
  });

  describe('OAuth Login', () => {
    it('should redirect to Google OAuth', async () => {
      await page.goto(`${baseURL}/login`);
      
      // Click Google login button
      await page.click('.google-login-button');
      
      // Wait for redirect
      await page.waitForNavigation();
      
      // Check if redirected to Google
      expect(page.url()).to.include('accounts.google.com');
    });

    it('should redirect to GitHub OAuth', async () => {
      await page.goto(`${baseURL}/login`);
      
      await page.click('.github-login-button');
      await page.waitForNavigation();
      
      expect(page.url()).to.include('github.com/login');
    });
  });

  describe('Password Reset', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await generateTestUser();
    });

    it('should send password reset email', async () => {
      await page.goto(`${baseURL}/forgot-password`);
      
      await page.type('#email', testUser.email);
      await page.click('#reset-button');
      
      // Wait for success message
      await page.waitForSelector('.success-message');
      const successText = await page.$eval('.success-message', el => el.textContent);
      expect(successText).to.include('Password reset email sent');
    });

    it('should reset password with valid token', async () => {
      // Generate reset token (mocked)
      const resetToken = 'valid-reset-token';
      
      await page.goto(`${baseURL}/reset-password?token=${resetToken}`);
      
      await page.type('#new-password', 'NewSecurePass123!');
      await page.type('#confirm-password', 'NewSecurePass123!');
      
      await page.click('#reset-password-button');
      
      await page.waitForNavigation();
      expect(page.url()).to.include('/login');
      
      // Check for success message
      const successText = await page.$eval('.success-message', el => el.textContent);
      expect(successText).to.include('Password successfully reset');
    });
  });

  describe('Two-Factor Authentication', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await generateTestUser({
        twoFactorEnabled: true,
        twoFactorSecret: 'test-secret'
      });
    });

    it('should prompt for 2FA code after login', async () => {
      await page.goto(`${baseURL}/login`);
      
      await page.type('#email', testUser.email);
      await page.type('#password', 'TestPass123!');
      await page.click('#login-button');
      
      // Wait for 2FA prompt
      await page.waitForSelector('#two-factor-code');
      
      // Enter 2FA code
      await page.type('#two-factor-code', '123456');
      await page.click('#verify-2fa-button');
      
      await page.waitForNavigation();
      expect(page.url()).to.include('/dashboard');
    });

    it('should setup 2FA in settings', async () => {
      // Login first
      await page.goto(`${baseURL}/login`);
      // ... login steps
      
      // Navigate to settings
      await page.goto(`${baseURL}/settings/security`);
      
      // Enable 2FA
      await page.click('#enable-2fa-button');
      
      // Wait for QR code
      await page.waitForSelector('.qr-code');
      
      // Verify with code
      await page.type('#verify-code', '123456');
      await page.click('#verify-button');
      
      // Check for success
      await page.waitForSelector('.success-message');
      const successText = await page.$eval('.success-message', el => el.textContent);
      expect(successText).to.include('Two-factor authentication enabled');
    });
  });

  describe('Session Management', () => {
    it('should logout successfully', async () => {
      // Login first
      const testUser = await generateTestUser();
      await page.goto(`${baseURL}/login`);
      await page.type('#email', testUser.email);
      await page.type('#password', 'TestPass123!');
      await page.click('#login-button');
      await page.waitForNavigation();
      
      // Logout
      await page.click('.user-menu-toggle');
      await page.click('#logout-button');
      
      await page.waitForNavigation();
      expect(page.url()).to.include('/login');
      
      // Try to access protected route
      await page.goto(`${baseURL}/dashboard`);
      expect(page.url()).to.include('/login');
    });

    it('should handle session expiry', async () => {
      // Login with short session
      const testUser = await generateTestUser();
      await page.goto(`${baseURL}/login`);
      // ... login steps
      
      // Wait for session to expire (mocked)
      await page.evaluate(() => {
        localStorage.removeItem('token');
      });
      
      // Try to perform action
      await page.goto(`${baseURL}/dashboard`);
      
      // Should redirect to login
      expect(page.url()).to.include('/login');
      
      // Check for session expired message
      const messageText = await page.$eval('.info-message', el => el.textContent);
      expect(messageText).to.include('Session expired');
    });
  });
});