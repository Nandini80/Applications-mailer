import EmailDatabase from './database.js';
import { getEmailTemplate, getEmailTemplateText } from './emailTemplate.js';

/**
 * Database-backed Email Scheduler
 * Schedules emails by saving them to database (no need to keep process running)
 */
class DatabaseScheduler {
  constructor() {
    this.db = new EmailDatabase();
  }

  /**
   * Schedule an email by saving it to the database
   * @param {Array<string>} recipients - Array of recipient email addresses
   * @param {string} subject - Email subject
   * @param {Date} scheduledDate - Date and time when email should be sent
   * @param {string} jobId - Optional unique job identifier
   * @returns {string} - Job ID
   */
  scheduleEmail(recipients, subject, scheduledDate, jobId = null) {
    const id = jobId || `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    // Check if the scheduled date is in the past
    if (scheduledDate < now) {
      throw new Error('Scheduled date must be in the future');
    }

    // Save to database
    const success = this.db.saveScheduledEmail(id, recipients, subject, scheduledDate);
    
    if (!success) {
      throw new Error('Failed to save scheduled email to database');
    }

    console.log(`\n📅 Email scheduled successfully!`);
    console.log(`   Job ID: ${id}`);
    console.log(`   Recipients: ${recipients.length}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Scheduled for: ${scheduledDate.toLocaleString()}`);
    
    return id;
  }

  /**
   * Schedule an email to be sent at 9 AM on a specific date
   * @param {Array<string>} recipients - Array of recipient email addresses
   * @param {string} subject - Email subject
   * @param {Date} date - Date when email should be sent (time will be set to 9:00 AM)
   * @param {string} jobId - Optional unique job identifier
   * @returns {string} - Job ID
   */
  scheduleEmailAt9AM(recipients, subject, date, jobId = null) {
    const scheduledDate = new Date(date);
    scheduledDate.setHours(9, 0, 0, 0); // Set to 9:00 AM
    return this.scheduleEmail(recipients, subject, scheduledDate, jobId);
  }

  /**
   * Get all scheduled emails
   * @returns {Array} - Array of scheduled email records
   */
  getScheduledEmails() {
    return this.db.getAllScheduledEmails();
  }

  /**
   * Get pending scheduled emails
   * @returns {Array} - Array of pending email records
   */
  getPendingEmails() {
    return this.db.getPendingEmails();
  }

  /**
   * List all scheduled jobs
   */
  listScheduledJobs() {
    const jobs = this.getScheduledEmails();
    
    if (jobs.length === 0) {
      console.log('\n📋 No scheduled emails found');
      return;
    }

    const pending = jobs.filter(j => j.status === 'pending');
    const sent = jobs.filter(j => j.status === 'sent');
    const failed = jobs.filter(j => j.status === 'failed');

    console.log(`\n📋 Scheduled Emails (Total: ${jobs.length}):`);
    console.log(`   Pending: ${pending.length} | Sent: ${sent.length} | Failed: ${failed.length}`);
    
    if (pending.length > 0) {
      console.log(`\n⏳ Pending Emails:`);
      pending.forEach((job, index) => {
        console.log(`\n${index + 1}. Job ID: ${job.id}`);
        console.log(`   Recipients: ${job.recipients.length}`);
        console.log(`   Subject: ${job.subject}`);
        console.log(`   Scheduled for: ${job.scheduledDate.toLocaleString()}`);
        console.log(`   Created: ${job.createdAt.toLocaleString()}`);
      });
    }
  }

  /**
   * Cancel/delete a scheduled email
   * @param {string} jobId - Job ID to cancel
   * @returns {boolean} - True if job was found and deleted
   */
  cancelScheduledEmail(jobId) {
    const success = this.db.deleteScheduledEmail(jobId);
    
    if (success) {
      console.log(`✓ Scheduled email ${jobId} cancelled successfully`);
    } else {
      console.log(`✗ Scheduled email ${jobId} not found`);
    }
    
    return success;
  }

  /**
   * Close database connection
   */
  close() {
    this.db.close();
  }
}

export default DatabaseScheduler;

