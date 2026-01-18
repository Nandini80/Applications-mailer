/**
 * Simple API to schedule emails
 * Usage: node scheduleEmail.js
 * 
 * Emails are saved to database - no need to keep process running!
 * Make sure to run the worker service to send the emails.
 */

import DatabaseScheduler from './dbScheduler.js';

/**
 * Schedule an email at 9 AM on a specific date
 * 
 * @param {Array<string>} recipients - Array of email addresses
 * @param {string} subject - Email subject
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {string} Job ID
 */
export function scheduleAt9AM(recipients, subject, date) {
  const scheduler = new DatabaseScheduler();
  try {
    const dateObj = new Date(date);
    const jobId = scheduler.scheduleEmailAt9AM(recipients, subject, dateObj);
    return jobId;
  } finally {
    scheduler.close();
  }
}

/**
 * Schedule an email at a specific date and time
 * 
 * @param {Array<string>} recipients - Array of email addresses
 * @param {string} subject - Email subject
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format (24-hour)
 * @returns {string} Job ID
 */
export function scheduleAtTime(recipients, subject, date, time) {
  const scheduler = new DatabaseScheduler();
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    // If time has passed, schedule for next day
    const now = new Date();
    if (scheduledDate <= now) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }
    
    const jobId = scheduler.scheduleEmail(recipients, subject, scheduledDate);
    return jobId;
  } finally {
    scheduler.close();
  }
}

/**
 * Example usage - Modify this section with your details
 */
// Run this file directly: node scheduleEmail.js
function runScheduleEmail() {
  // ============================================
  // CONFIGURE YOUR EMAIL HERE
  // ============================================
  
  const RECIPIENTS = [
    'nandinijindal41@gmail.com'
  ];
  
  const SUBJECT = 'Application for Software Developer Opportunity - Nandini Jindal';
  const DATE = '2026-01-05'; // YYYY-MM-DD format
  const TIME = '23:07'; // HH:MM format (24-hour), use '09:00' for 9 AM
  
  // ============================================
  
  if (RECIPIENTS.length === 0) {
    console.log('⚠️  Please add recipient email addresses in scheduleEmail.js');
    console.log('\nExample:');
    console.log('const RECIPIENTS = [\'company1@example.com\', \'company2@example.com\'];');
    process.exit(1);
  }
  
  try {
    console.log('📅 Scheduling email...\n');
    
    const scheduler = new DatabaseScheduler();
    let jobId;
    
    if (TIME === '09:00') {
      jobId = scheduleAt9AM(RECIPIENTS, SUBJECT, DATE);
      console.log(`\n✓ Email scheduled successfully!`);
      console.log(`  Job ID: ${jobId}`);
      console.log(`  Date: ${DATE} at 9:00 AM`);
      console.log(`  Recipients: ${RECIPIENTS.length}`);
    } else {
      jobId = scheduleAtTime(RECIPIENTS, SUBJECT, DATE, TIME);
      console.log(`\n✓ Email scheduled successfully!`);
      console.log(`  Job ID: ${jobId}`);
      console.log(`  Date: ${DATE} at ${TIME}`);
      console.log(`  Recipients: ${RECIPIENTS.length}`);
    }
    
    scheduler.listScheduledJobs();
    scheduler.close();
    
    console.log('\n✓ Email saved to database!');
    console.log('  No need to keep this process running.');
    console.log('\n📌 Next steps:');
    console.log('  1. Run the worker service to send emails:');
    console.log('     npm run worker');
    console.log('  2. Or set up the worker as a background service (see README.md)\n');
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
runScheduleEmail();
