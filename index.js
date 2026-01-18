import EmailScheduler from './scheduler.js';
import MailService from './mailService.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Main entry point for the email scheduler service
 * 
 * Usage examples are provided below. You can modify the configuration
 * to schedule your emails.
 */

const scheduler = new EmailScheduler();
const mailService = new MailService();

/**
 * Example 1: Schedule an email at 9 AM on a specific date
 */
function scheduleEmailAt9AM() {
  // Example: Schedule for tomorrow at 9 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const recipients = [
    'recipient1@example.com',
    'recipient2@example.com',
    // Add more recipients here
  ];
  
  const subject = 'Application for SDE Internship Opportunity - Nandini Jindal';
  
  const jobId = scheduler.scheduleEmailAt9AM(recipients, subject, tomorrow);
  console.log(`\n✓ Email scheduled with Job ID: ${jobId}`);
}

/**
 * Example 2: Schedule an email at a custom date and time
 */
function scheduleCustomEmail() {
  // Example: Schedule for a specific date and time
  const scheduledDate = new Date('2024-12-25T09:00:00'); // Adjust date as needed
  
  const recipients = [
    'recipient1@example.com',
    'recipient2@example.com',
  ];
  
  const subject = 'Application for SDE Internship Opportunity - Nandini Jindal';
  
  const jobId = scheduler.scheduleEmail(recipients, subject, scheduledDate);
  console.log(`\n✓ Email scheduled with Job ID: ${jobId}`);
}

/**
 * Example 3: Send email immediately (no scheduling)
 */
async function sendEmailNow() {
  const recipients = [
    'recipient1@example.com',
    'recipient2@example.com',
  ];
  
  const subject = 'Application for SDE Internship Opportunity - Nandini Jindal';
  
  await mailService.sendTemplateEmail(recipients, subject);
}

/**
 * Helper function to schedule email from command line arguments or configuration
 * You can modify this function to accept parameters from user input
 */
function scheduleEmailFromConfig(recipients, subject, date, time = '09:00') {
  const [hours, minutes] = time.split(':').map(Number);
  const scheduledDate = new Date(date);
  scheduledDate.setHours(hours, minutes, 0, 0);
  
  // If the scheduled time has already passed today, schedule for tomorrow
  const now = new Date();
  if (scheduledDate <= now) {
    scheduledDate.setDate(scheduledDate.getDate() + 1);
  }
  
  const jobId = scheduler.scheduleEmail(recipients, subject, scheduledDate);
  console.log(`\n✓ Email scheduled successfully!`);
  console.log(`  Job ID: ${jobId}`);
  console.log(`  Scheduled for: ${scheduledDate.toLocaleString()}`);
  console.log(`  Recipients: ${recipients.length}`);
  
  return jobId;
}

// ============================================
// CONFIGURATION AREA - MODIFY THIS SECTION
// ============================================

// Configure your email schedule here
const CONFIG = {
  // Add recipient email addresses here
  recipients: [
    // 'company1@example.com',
    // 'company2@example.com',
    // Add more email addresses...
  ],
  
  // Email subject
  subject: 'Application for SDE Internship Opportunity - Nandini Jindal',
  
  // Date (YYYY-MM-DD format)
  date: '2024-12-20', // Change this to your desired date
  
  // Time (HH:MM format, 24-hour)
  time: '09:00' // 9 AM
};

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('🚀 Email Scheduler Service Starting...\n');
  
  // Check if recipients are configured
  if (!CONFIG.recipients || CONFIG.recipients.length === 0) {
    console.log('⚠️  No recipients configured!');
    console.log('Please add recipient email addresses in the CONFIG section of index.js\n');
    console.log('Example usage:');
    console.log('  scheduleEmailFromConfig([\'email1@example.com\', \'email2@example.com\'],');
    console.log('                        \'Subject\',');
    console.log('                        \'2024-12-20\',');
    console.log('                        \'09:00\');');
    return;
  }
  
  try {
    // Schedule the email
    scheduleEmailFromConfig(
      CONFIG.recipients,
      CONFIG.subject,
      CONFIG.date,
      CONFIG.time
    );
    
    // List all scheduled jobs
    scheduler.listScheduledJobs();
    
    console.log('\n✓ Setup complete! The email will be sent at the scheduled time.');
    console.log('  Keep this process running until the email is sent.\n');
    
    // Keep the process alive
    process.on('SIGINT', () => {
      console.log('\n\n👋 Shutting down...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

// Uncomment the line below to run automatically
// main();

// Export functions for use in other files or REPL
export {
  scheduler,
  mailService,
  scheduleEmailFromConfig,
  scheduleEmailAt9AM,
  scheduleCustomEmail,
  sendEmailNow
};

// For direct script execution - uncomment to run
// main();

