import nodemailer from 'nodemailer';
import { getEmailTemplate, getEmailTemplateText } from './emailTemplate.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Mail Service for sending emails via Nodemailer
 */
class MailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Initialize Nodemailer transporter with Gmail configuration
   */
  initializeTransporter() {
    // For Gmail, you'll need to use an App Password
    // Go to Google Account > Security > 2-Step Verification > App Passwords
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'nandinijindal010@gmail.com',
        pass: process.env.EMAIL_PASSWORD // App Password from Gmail
      }
    });

    // Verify transporter configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email transporter verification failed:', error);
        console.log('\n⚠️  Please make sure:');
        console.log('1. EMAIL_USER and EMAIL_PASSWORD are set in .env file');
        console.log('2. You have enabled 2-Step Verification on your Google Account');
        console.log('3. You have generated an App Password (not your regular password)');
        console.log('   Steps: Google Account > Security > 2-Step Verification > App Passwords\n');
      } else {
        console.log('✓ Email transporter configured successfully');
      }
    });
  }

  /**
   * Send email to a single recipient
   * @param {string} to - Recipient email address
   * @param {string} subject - Email subject
   * @param {string} html - HTML email body
   * @param {string} text - Plain text email body
   * @returns {Promise} - Promise that resolves when email is sent
   */
  async sendEmail(to, subject, html, text) {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'nandinijindal010@gmail.com',
      to: to,
      subject: subject,
      html: html,
      text: text
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✓ Email sent successfully to ${to}`);
      console.log(`  Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId, to };
    } catch (error) {
      console.error(`✗ Failed to send email to ${to}:`, error.message);
      return { success: false, error: error.message, to };
    }
  }

  /**
   * Send email to multiple recipients
   * @param {Array<string>} recipients - Array of recipient email addresses
   * @param {string} subject - Email subject
   * @param {string} html - HTML email body
   * @param {string} text - Plain text email body
   * @param {number} delay - Delay in milliseconds between each email (to avoid rate limiting)
   * @returns {Promise<Array>} - Array of results for each email
   */
  async sendBulkEmail(recipients, subject, html, text, delay = 1000) {
    const results = [];
    
    console.log(`\n📧 Sending emails to ${recipients.length} recipients...`);
    
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      console.log(`\n[${i + 1}/${recipients.length}] Sending to ${recipient}...`);
      
      const result = await this.sendEmail(recipient, subject, html, text);
      results.push(result);
      
      // Add delay between emails to avoid rate limiting (except for the last email)
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    console.log(`\n📊 Summary:`);
    console.log(`  ✓ Successful: ${successCount}`);
    console.log(`  ✗ Failed: ${failureCount}`);
    
    return results;
  }

  /**
   * Send email using the default template
   * @param {Array<string>} recipients - Array of recipient email addresses
   * @param {string} subject - Email subject
   * @returns {Promise<Array>} - Array of results for each email
   */
  async sendTemplateEmail(recipients, subject) {
    const html = getEmailTemplate();
    const text = getEmailTemplateText();
    
    return await this.sendBulkEmail(recipients, subject, html, text);
  }
}

export default MailService;

