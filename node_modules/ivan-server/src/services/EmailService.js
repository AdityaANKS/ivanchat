import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    this.templates = new Map();
    this.loadTemplates();
  }

  async loadTemplates() {
    const templatesDir = path.join(__dirname, '../../templates/emails');
    
    try {
      const templates = [
        'verification',
        'password-reset',
        'welcome',
        'notification',
        'weekly-digest',
      ];

      for (const template of templates) {
        const htmlPath = path.join(templatesDir, `${template}.html`);
        const html = await fs.readFile(htmlPath, 'utf-8');
        this.templates.set(template, handlebars.compile(html));
      }
    } catch (error) {
      console.error('Failed to load email templates:', error);
    }
  }

  async sendMail(options) {
    try {
      const mailOptions = {
        from: `"${process.env.APP_NAME || 'Ivan Chat'}" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    
    const html = this.templates.get('verification')({
      appName: process.env.APP_NAME || 'Ivan Chat',
      verificationUrl,
      year: new Date().getFullYear(),
    });

    await this.sendMail({
      to: email,
      subject: 'Verify your email address',
      html,
      text: `Please verify your email by clicking: ${verificationUrl}`,
    });
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    
    const html = this.templates.get('password-reset')({
      appName: process.env.APP_NAME || 'Ivan Chat',
      resetUrl,
      year: new Date().getFullYear(),
    });

    await this.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html,
      text: `Reset your password by clicking: ${resetUrl}`,
    });
  }

  async sendWelcomeEmail(email, username) {
    const html = this.templates.get('welcome')({
      appName: process.env.APP_NAME || 'Ivan Chat',
      username,
      loginUrl: `${process.env.CLIENT_URL}/login`,
      year: new Date().getFullYear(),
    });

    await this.sendMail({
      to: email,
      subject: `Welcome to ${process.env.APP_NAME || 'Ivan Chat'}!`,
      html,
      text: `Welcome to Ivan Chat, ${username}!`,
    });
  }

  async sendNotificationEmail(email, notification) {
    const html = this.templates.get('notification')({
      appName: process.env.APP_NAME || 'Ivan Chat',
      title: notification.title,
      message: notification.message,
      actionUrl: notification.actionUrl,
      actionText: notification.actionText || 'View',
      year: new Date().getFullYear(),
    });

    await this.sendMail({
      to: email,
      subject: notification.title,
      html,
      text: notification.message,
    });
  }

  async sendWeeklyDigest(email, digest) {
    const html = this.templates.get('weekly-digest')({
      appName: process.env.APP_NAME || 'Ivan Chat',
      username: digest.username,
      stats: digest.stats,
      highlights: digest.highlights,
      recommendations: digest.recommendations,
      year: new Date().getFullYear(),
    });

    await this.sendMail({
      to: email,
      subject: 'Your Weekly Ivan Chat Digest',
      html,
    });
  }

  async sendBulkEmails(recipients, template, data) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        await this.sendMail({
          to: recipient.email,
          subject: template.subject,
          html: this.templates.get(template.name)({
            ...data,
            username: recipient.username,
          }),
        });
        
        results.push({ email: recipient.email, success: true });
      } catch (error) {
        results.push({ email: recipient.email, success: false, error: error.message });
      }
    }
    
    return results;
  }
}

export default new EmailService();
export { EmailService };

// Convenience exports
export const sendVerificationEmail = (email, token) => 
  new EmailService().sendVerificationEmail(email, token);

export const sendPasswordResetEmail = (email, token) => 
  new EmailService().sendPasswordResetEmail(email, token);

export const sendWelcomeEmail = (email, username) => 
  new EmailService().sendWelcomeEmail(email, username);