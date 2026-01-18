import cron from 'node-cron';
import MailService from './mailService.js';
import { getEmailTemplate, getEmailTemplateText } from './emailTemplate.js';

/**
 * Email Scheduler Service
 * Handles scheduling emails at specific dates and times
 */
class EmailScheduler {
  constructor() {
    this.mailService = new MailService();
    this.scheduledJobs = new Map(); // Store scheduled jobs
  }

  /**
   * Schedule an email to be sent at a specific date and time
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

    const html = getEmailTemplate();
    const text = getEmailTemplateText();

    // Calculate delay in milliseconds
    const delay = scheduledDate.getTime() - now.getTime();

    console.log(`\n📅 Scheduling email job: ${id}`);
    console.log(`   Recipients: ${recipients.length}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Scheduled for: ${scheduledDate.toLocaleString()}`);
    console.log(`   Time until send: ${Math.round(delay / 1000 / 60)} minutes`);

    // Use setTimeout for one-time scheduling
    const timeoutId = setTimeout(async () => {
      console.log(`\n⏰ Executing scheduled job: ${id}`);
      await this.mailService.sendBulkEmail(recipients, subject, html, text);
      this.scheduledJobs.delete(id);
      console.log(`✓ Job ${id} completed and removed from schedule`);
    }, delay);

    // Store the timeout ID
    this.scheduledJobs.set(id, {
      timeoutId,
      recipients,
      subject,
      scheduledDate,
      createdAt: now
    });

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
   * Schedule an email using cron expression (for recurring emails)
   * @param {Array<string>} recipients - Array of recipient email addresses
   * @param {string} subject - Email subject
   * @param {string} cronExpression - Cron expression (e.g., '0 9 * * *' for 9 AM daily)
   * @param {string} jobId - Optional unique job identifier
   * @returns {string} - Job ID
   */
  scheduleRecurringEmail(recipients, subject, cronExpression, jobId = null) {
    const id = jobId || `recurring_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (!cron.validate(cronExpression)) {
      throw new Error('Invalid cron expression');
    }

    const html = getEmailTemplate();
    const text = getEmailTemplateText();

    console.log(`\n🔄 Scheduling recurring email job: ${id}`);
    console.log(`   Cron: ${cronExpression}`);
    console.log(`   Recipients: ${recipients.length}`);
    console.log(`   Subject: ${subject}`);

    const task = cron.schedule(cronExpression, async () => {
      console.log(`\n⏰ Executing recurring job: ${id}`);
      await this.mailService.sendBulkEmail(recipients, subject, html, text);
    }, {
      scheduled: true,
      timezone: 'Asia/Kolkata' // Adjust timezone as needed
    });

    this.scheduledJobs.set(id, {
      task,
      recipients,
      subject,
      cronExpression,
      type: 'recurring',
      createdAt: new Date()
    });

    return id;
  }

  /**
   * Cancel a scheduled job
   * @param {string} jobId - Job ID to cancel
   * @returns {boolean} - True if job was found and cancelled
   */
  cancelScheduledJob(jobId) {
    const job = this.scheduledJobs.get(jobId);
    
    if (!job) {
      console.log(`✗ Job ${jobId} not found`);
      return false;
    }

    if (job.timeoutId) {
      clearTimeout(job.timeoutId);
    } else if (job.task) {
      job.task.stop();
    }

    this.scheduledJobs.delete(jobId);
    console.log(`✓ Job ${jobId} cancelled successfully`);
    return true;
  }

  /**
   * Get all scheduled jobs
   * @returns {Array} - Array of job information
   */
  getScheduledJobs() {
    return Array.from(this.scheduledJobs.entries()).map(([id, job]) => ({
      id,
      recipients: job.recipients,
      subject: job.subject,
      scheduledDate: job.scheduledDate,
      cronExpression: job.cronExpression,
      type: job.type || 'one-time',
      createdAt: job.createdAt
    }));
  }

  /**
   * List all scheduled jobs
   */
  listScheduledJobs() {
    const jobs = this.getScheduledJobs();
    
    if (jobs.length === 0) {
      console.log('\n📋 No scheduled jobs');
      return;
    }

    console.log(`\n📋 Scheduled Jobs (${jobs.length}):`);
    jobs.forEach((job, index) => {
      console.log(`\n${index + 1}. Job ID: ${job.id}`);
      console.log(`   Type: ${job.type}`);
      console.log(`   Recipients: ${job.recipients.length}`);
      console.log(`   Subject: ${job.subject}`);
      if (job.scheduledDate) {
        console.log(`   Scheduled for: ${job.scheduledDate.toLocaleString()}`);
      }
      if (job.cronExpression) {
        console.log(`   Cron: ${job.cronExpression}`);
      }
      console.log(`   Created: ${job.createdAt.toLocaleString()}`);
    });
  }
}

export default EmailScheduler;

