import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Database service for storing scheduled emails
 */
class EmailDatabase {
  constructor() {
    const dbPath = join(__dirname, 'scheduled_emails.db');
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  /**
   * Initialize database schema
   */
  initializeDatabase() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS scheduled_emails (
        id TEXT PRIMARY KEY,
        recipients TEXT NOT NULL,
        subject TEXT NOT NULL,
        scheduled_date TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        sent_at TEXT,
        error TEXT
      )
    `);

    // Create index on scheduled_date for faster queries
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_scheduled_date 
      ON scheduled_emails(scheduled_date, status)
    `);
  }

  /**
   * Save a scheduled email to the database
   * @param {string} id - Unique job ID
   * @param {Array<string>} recipients - Array of email addresses
   * @param {string} subject - Email subject
   * @param {Date} scheduledDate - When to send the email
   * @returns {boolean} - Success status
   */
  saveScheduledEmail(id, recipients, subject, scheduledDate) {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO scheduled_emails (id, recipients, subject, scheduled_date, status)
        VALUES (?, ?, ?, ?, 'pending')
      `);

      stmt.run(
        id,
        JSON.stringify(recipients), // Store as JSON array
        subject,
        scheduledDate.toISOString()
      );

      return true;
    } catch (error) {
      console.error('Error saving scheduled email:', error);
      return false;
    }
  }

  /**
   * Get all pending emails that are due to be sent
   * @param {Date} now - Current date/time
   * @returns {Array} - Array of email records
   */
  getDueEmails(now = new Date()) {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM scheduled_emails
        WHERE status = 'pending'
        AND scheduled_date <= ?
        ORDER BY scheduled_date ASC
      `);

      const rows = stmt.all(now.toISOString());
      
      // Parse recipients from JSON
      return rows.map(row => ({
        ...row,
        recipients: JSON.parse(row.recipients),
        scheduledDate: new Date(row.scheduled_date),
        createdAt: new Date(row.created_at)
      }));
    } catch (error) {
      console.error('Error getting due emails:', error);
      return [];
    }
  }

  /**
   * Get all scheduled emails (pending, sent, failed)
   * @returns {Array} - Array of email records
   */
  getAllScheduledEmails() {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM scheduled_emails
        ORDER BY scheduled_date DESC
      `);

      const rows = stmt.all();
      
      return rows.map(row => ({
        ...row,
        recipients: JSON.parse(row.recipients),
        scheduledDate: new Date(row.scheduled_date),
        createdAt: new Date(row.created_at),
        sentAt: row.sent_at ? new Date(row.sent_at) : null
      }));
    } catch (error) {
      console.error('Error getting all scheduled emails:', error);
      return [];
    }
  }

  /**
   * Get pending scheduled emails
   * @returns {Array} - Array of pending email records
   */
  getPendingEmails() {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM scheduled_emails
        WHERE status = 'pending'
        ORDER BY scheduled_date ASC
      `);

      const rows = stmt.all();
      
      return rows.map(row => ({
        ...row,
        recipients: JSON.parse(row.recipients),
        scheduledDate: new Date(row.scheduled_date),
        createdAt: new Date(row.created_at)
      }));
    } catch (error) {
      console.error('Error getting pending emails:', error);
      return [];
    }
  }

  /**
   * Mark an email as sent
   * @param {string} id - Job ID
   * @returns {boolean} - Success status
   */
  markAsSent(id) {
    try {
      const stmt = this.db.prepare(`
        UPDATE scheduled_emails
        SET status = 'sent', sent_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error('Error marking email as sent:', error);
      return false;
    }
  }

  /**
   * Mark an email as failed
   * @param {string} id - Job ID
   * @param {string} errorMessage - Error message
   * @returns {boolean} - Success status
   */
  markAsFailed(id, errorMessage) {
    try {
      const stmt = this.db.prepare(`
        UPDATE scheduled_emails
        SET status = 'failed', error = ?, sent_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      const result = stmt.run(errorMessage, id);
      return result.changes > 0;
    } catch (error) {
      console.error('Error marking email as failed:', error);
      return false;
    }
  }

  /**
   * Delete a scheduled email
   * @param {string} id - Job ID
   * @returns {boolean} - Success status
   */
  deleteScheduledEmail(id) {
    try {
      const stmt = this.db.prepare(`
        DELETE FROM scheduled_emails WHERE id = ?
      `);

      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting scheduled email:', error);
      return false;
    }
  }

  /**
   * Close database connection
   */
  close() {
    this.db.close();
  }
}

export default EmailDatabase;

