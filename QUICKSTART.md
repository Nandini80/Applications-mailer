# Quick Start Guide - Database-Backed Scheduler

## 🎯 Key Feature: No Need to Keep Terminal Open for Scheduling!

Emails are saved to a database. You can close the terminal after scheduling!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Gmail App Password

1. Go to [Google Account](https://myaccount.google.com/) > Security
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App Passwords** (under Security)
4. Generate password for "Mail"
5. Copy the 16-character password

## Step 3: Create .env File

Create a file named `.env` in the root directory:

```
EMAIL_USER=nandinijindal010@gmail.com
EMAIL_PASSWORD=your_16_character_app_password_here
```

## Step 4: Schedule Your Email

Edit `scheduleEmail.js` and update:

```javascript
const RECIPIENTS = [
  'company1@example.com',
  'company2@example.com',
  // Add more emails...
];

const SUBJECT = 'Application for SDE Internship Opportunity - Nandini Jindal';
const DATE = '2024-12-20'; // Change to your desired date
const TIME = '09:00'; // 9 AM (or change to any time like '14:30')
```

Then run:
```bash
npm run schedule
```

**That's it!** The email is saved to the database. You can close the terminal now! 🎉

## Step 5: Start the Worker (Choose One Option)

### ⚠️ IMPORTANT: Worker Must Be Running!

The worker checks the database and sends emails. You need ONE of these options:

### Option A: Run Worker Manually (For Testing)

```bash
npm run worker
```

**Keep this terminal open!** The worker will check every minute and send due emails.

### Option B: Windows Task Scheduler (Recommended - No Terminal Needed!)

Set up a Windows Task that runs automatically in the background. **No terminal needed!**

See `SETUP_WORKER_TASK.md` for detailed instructions.

Quick setup:
1. Open **Task Scheduler**
2. Create Basic Task: "Email Worker"
3. Trigger: Daily → Repeat every 1 minute → Duration: Indefinitely
4. Action: Start program `node` with arguments `worker.js --once`
5. Start in: Your project directory
6. Check "Run whether user is logged on or not"

### Option C: Background Batch File (Simple Alternative)

Double-click `worker-continuous.bat` - it runs in background and checks every minute.
Less elegant but simpler - the window will stay open but minimized.

## How It Works

1. **Schedule**: Run `npm run schedule` → Email saved to database → Exit (no terminal needed!)
2. **Worker**: Runs in background (Task Scheduler) or terminal → Checks database every minute → Sends due emails

## Summary

- ✅ **Scheduling emails**: No terminal needed - run `npm run schedule` and close terminal
- ⚠️ **Sending emails**: Worker MUST be running (choose one option above)
- 🎯 **Best setup**: Schedule emails (no terminal) + Windows Task Scheduler for worker (no terminal)
