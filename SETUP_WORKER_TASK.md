# Setting Up Worker as Windows Scheduled Task

This allows the worker to run automatically without keeping a terminal open!

## Steps

1. **Open Task Scheduler**
   - Press `Windows + R`
   - Type: `taskschd.msc`
   - Press Enter

2. **Create Basic Task**
   - Click "Create Basic Task" (right side)
   - Name: `Email Worker`
   - Description: `Checks for due emails and sends them`
   - Click Next

3. **Set Trigger**
   - Choose "Daily" (or "When the computer starts")
   - Click Next
   - Set time (e.g., 12:00 AM)
   - Check "Repeat task every: 1 minute"
   - Duration: "Indefinitely"
   - Click Next

4. **Set Action**
   - Choose "Start a program"
   - Click Next
   - Program/script: `node`
     - Or full path: `C:\Program Files\nodejs\node.exe`
   - Add arguments: `worker.js --once`
     - Or full path: `C:\Users\HP\Desktop\React\company-mailer\worker.js --once`
   - Start in: `C:\Users\HP\Desktop\React\company-mailer`
   - Click Next

5. **Finish**
   - Check "Open the Properties dialog..."
   - Click Finish

6. **Configure Properties**
   - Check "Run whether user is logged on or not"
   - Check "Run with highest privileges" (if needed)
   - Click OK

## Alternative: More Frequent Checks

If you want the worker to check more frequently, create multiple tasks or use a different approach:

- Create task that runs every 1-5 minutes
- Or use a batch file that runs in a loop (simpler but less efficient)

## Verify It's Working

1. Schedule an email for a few minutes in the future
2. Wait and check if it gets sent automatically
3. Check Task Scheduler → Task Scheduler Library → Email Worker
4. Check "History" tab to see if task is running

