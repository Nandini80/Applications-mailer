# Company Mailer - Scheduled Email Service

A Node.js service for scheduling and sending bulk emails using Nodemailer. Perfect for sending job applications or any scheduled email campaigns.

## Features

- ✅ Schedule emails at specific dates and times
- ✅ Send emails to multiple recipients
- ✅ Beautiful HTML email templates
- ✅ Support for one-time and recurring schedules
- ✅ Easy configuration

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Gmail App Password

Since you're using Gmail, you need to create an App Password (not your regular password):

1. Go to your [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security**
3. Enable **2-Step Verification** if not already enabled
4. Go to **App Passwords** (under Security)
5. Select **Mail** and your device
6. Generate the password
7. Copy the 16-character password

### 3. Create Environment File

Copy the example environment file and add your credentials:

```bash
copy .env.example .env
```

Then edit `.env` and add your Gmail credentials:

```
EMAIL_USER=nandinijindal010@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
```

### 4. Configure Email Recipients

Edit `index.js` and update the `CONFIG` section:

```javascript
const CONFIG = {
  recipients: [
    'company1@example.com',
    'company2@example.com',
    // Add more email addresses...
  ],
  subject: 'Application for SDE Internship Opportunity - Nandini Jindal',
  date: '2024-12-20', // YYYY-MM-DD format
  time: '09:00' // HH:MM format (24-hour)
};
```

### 5. Run the Service

```bash
npm start
```

The email will be scheduled and sent at the specified time. **Keep the process running** until the email is sent.

## How It Works

1. **Schedule emails**: Run `npm run schedule` (or `node scheduleEmail.js`)
   - Emails are saved to a SQLite database
   - Process exits immediately - no need to keep it running!

2. **Worker service**: Run `npm run worker` (or set up as Windows Task)
   - Checks database every minute for due emails
   - Automatically sends emails when scheduled time arrives
   - Can run in the background

## Usage Examples

### Schedule Email (Quick Way)

Edit `scheduleEmail.js`:
```javascript
const RECIPIENTS = ['company1@example.com', 'company2@example.com'];
const SUBJECT = 'Application for SDE Internship Opportunity - Nandini Jindal';
const DATE = '2024-12-20';
const TIME = '09:00'; // 9 AM
```

Then run:
```bash
npm run schedule
```

### Schedule Email Programmatically

```javascript
import { scheduleAt9AM, scheduleAtTime } from './scheduleEmail.js';

// Schedule at 9 AM
const jobId = scheduleAt9AM(
  ['company1@example.com'],
  'Application for SDE Internship Opportunity - Nandini Jindal',
  '2024-12-20'
);

// Schedule at specific time
const jobId2 = scheduleAtTime(
  ['company2@example.com'],
  'Application for SDE Internship Opportunity - Nandini Jindal',
  '2024-12-20',
  '14:30' // 2:30 PM
);
```

### View Scheduled Emails

```javascript
import DatabaseScheduler from './dbScheduler.js';

const scheduler = new DatabaseScheduler();
scheduler.listScheduledJobs();
scheduler.close();
```

### Cancel a Scheduled Email

```javascript
import DatabaseScheduler from './dbScheduler.js';

const scheduler = new DatabaseScheduler();
scheduler.cancelScheduledEmail('job_id_here');
scheduler.close();
```

## Programmatic Usage

You can also use the service programmatically in your own code:

```javascript
import { scheduleEmailFromConfig } from './index.js';

// Schedule email
const jobId = scheduleEmailFromConfig(
  ['recipient1@example.com', 'recipient2@example.com'],
  'Application for SDE Internship Opportunity - Nandini Jindal',
  '2024-12-20',  // Date
  '09:00'        // Time
);
```

## Email Template

The email template includes:
- Professional HTML formatting
- Your background and experience
- Resume link
- Contact information (Email, Phone, Portfolio, GitHub, LinkedIn)

The template is defined in `emailTemplate.js` and can be customized as needed.

## Important Notes

1. **Gmail App Password**: Always use an App Password, not your regular Gmail password
2. **Worker Service**: The worker **must be running** to send emails. You have 3 options:
   - **Option A**: Keep terminal open with `npm run worker` (for testing)
   - **Option B**: Set up Windows Task Scheduler (recommended - runs automatically in background)
   - **Option C**: Run `worker-continuous.bat` (runs in background, but window stays open)
3. **Rate Limiting**: There's a 1-second delay between emails to avoid Gmail rate limiting
4. **Database**: Scheduled emails are stored in `scheduled_emails.db` (SQLite)
5. **No Terminal for Scheduling**: You can schedule emails and close terminal - but worker must run to send them
6. **Gmail Scheduled Section**: Emails sent via SMTP won't appear in Gmail's "Scheduled" section (that's only for emails composed in Gmail)

## Troubleshooting

### "Invalid login" error
- Make sure you're using an App Password, not your regular password
- Verify 2-Step Verification is enabled
- Check that EMAIL_USER and EMAIL_PASSWORD are set correctly in `.env`

### Email not sending
- Verify the process is still running at the scheduled time
- Check that the scheduled date/time is in the future
- Review console logs for error messages

### Rate limiting
- Gmail has sending limits (usually 500 emails per day for free accounts)
- The service includes a 1-second delay between emails by default
