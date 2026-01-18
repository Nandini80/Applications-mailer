import EmailDatabase from './database.js';
import MailService from './mailService.js';
import { getEmailTemplate, getEmailTemplateText } from './emailTemplate.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Worker service that runs in the background
 * Checks the database periodically for due emails and sends them
 */
class EmailWorker {
  constructor(checkIntervalMinutes = 1) {
    this.db = new EmailDatabase();
    this.mailService = new MailService();
    this.checkIntervalMinutes = checkIntervalMinutes;
    this.isRunning = false;
    this.intervalId = null;
  }

  /**
   * Check for due emails and send them
   */
  async checkAndSendDueEmails() {
    try {
      const now = new Date();
      const dueEmails = this.db.getDueEmails(now);

      if (dueEmails.length === 0) {
        return; // No emails due
      }

      console.log(`\n⏰ Found ${dueEmails.length} email(s) due to be sent`);

      for (const email of dueEmails) {
        try {
          console.log(`\n📧 Sending email: ${email.id}`);
          console.log(`   Subject: ${email.subject}`);
          console.log(`   Recipients: ${email.recipients.length}`);

          const html = getEmailTemplate();
          const text = getEmailTemplateText();

          const results = await this.mailService.sendBulkEmail(
            email.recipients,
            email.subject,
            html,
            text
          );

          // Check if all emails were sent successfully
          const allSuccessful = results.every(r => r.success);
          
          if (allSuccessful) {
            this.db.markAsSent(email.id);
            console.log(`✓ Email ${email.id} sent successfully`);
          } else {
            const errors = results.filter(r => !r.success).map(r => r.error).join('; ');
            this.db.markAsFailed(email.id, errors);
            console.log(`✗ Email ${email.id} failed: ${errors}`);
          }

        } catch (error) {
          console.error(`✗ Error sending email ${email.id}:`, error.message);
          this.db.markAsFailed(email.id, error.message);
        }
      }

    } catch (error) {
      console.error('Error checking due emails:', error);
    }
  }

  /**
   * Start the worker (runs continuously)
   */
  start() {
    if (this.isRunning) {
      console.log('Worker is already running');
      return;
    }

    this.isRunning = true;
    console.log(`\n🚀 Email Worker started`);
    console.log(`   Checking for due emails every ${this.checkIntervalMinutes} minute(s)`);
    console.log(`   Press Ctrl+C to stop\n`);

    // Check immediately on start
    this.checkAndSendDueEmails();

    // Then check periodically
    const intervalMs = this.checkIntervalMinutes * 60 * 1000;
    this.intervalId = setInterval(() => {
      this.checkAndSendDueEmails();
    }, intervalMs);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\n👋 Shutting down worker...');
      this.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n\n👋 Shutting down worker...');
      this.stop();
      process.exit(0);
    });
  }

  /**
   * Stop the worker
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.db.close();
    console.log('✓ Worker stopped');
  }

  /**
   * Run once (check and send due emails, then exit)
   * Useful for cron jobs or scheduled tasks
   */
  async runOnce() {
    console.log('🔍 Checking for due emails...\n');
    await this.checkAndSendDueEmails();
    this.db.close();
    console.log('\n✓ Check complete');
  }
}

// Run worker if this file is executed directly
// Simple check: if this file is run with node worker.js, execute the worker
const mainModule = process.argv[1];
if (mainModule && (mainModule.endsWith('worker.js') || mainModule.replace(/\\/g, '/').endsWith('worker.js'))) {
  const worker = new EmailWorker(1); // Check every 1 minute
  
  // Check command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--once')) {
    // Run once and exit (useful for cron/scheduled tasks)
    worker.runOnce().then(() => process.exit(0));
  } else {
    // Run continuously
    worker.start();
  }
}

export default EmailWorker;

