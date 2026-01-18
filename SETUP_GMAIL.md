# Gmail App Password Setup Guide

## Why App Password?

Gmail requires an **App Password** (not your regular password) for third-party applications like this email service. This is a security feature.

## Step-by-Step Instructions

### Step 1: Enable 2-Step Verification

1. Go to your [Google Account](https://myaccount.google.com/)
2. Click on **Security** (left sidebar)
3. Under "Signing in to Google", find **2-Step Verification**
4. If it's **OFF**, click it and follow the prompts to enable it
   - You'll need your phone number
   - Google will send a verification code

### Step 2: Generate App Password

1. Still in **Security** settings
2. Scroll down to "Signing in to Google"
3. Click on **App Passwords** (may be under "2-Step Verification" section)
   - If you don't see "App Passwords", make sure 2-Step Verification is enabled first
4. You may be asked to sign in again
5. Under "Select app", choose **Mail**
6. Under "Select device", choose **Other (Custom name)**
7. Type: `Node Mailer Service` (or any name you prefer)
8. Click **Generate**
9. **COPY THE 16-CHARACTER PASSWORD** (it looks like: `abcd efgh ijkl mnop`)
   - ⚠️ **This is the only time you'll see it!**
   - Remove the spaces when copying (should be 16 characters total)

### Step 3: Update .env File

1. Open the `.env` file in your project
2. Make sure it looks like this (replace with YOUR App Password):

```
EMAIL_USER=nandinijindal010@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Important:**
- Use the **16-character App Password** (no spaces)
- **NOT** your regular Gmail password
- Keep this file secure and never commit it to git

### Step 4: Test the Configuration

Run your service again:
```bash
node scheduleEmail.js
```

You should see:
```
✓ Email transporter configured successfully
```

Instead of the authentication error.

## Troubleshooting

### "App Passwords" option not showing?
- Make sure 2-Step Verification is **enabled** first
- Wait a few minutes after enabling 2-Step Verification
- Try refreshing the page

### Still getting authentication errors?
1. Double-check the App Password (16 characters, no spaces)
2. Make sure `.env` file has no extra spaces or quotes
3. Restart the Node.js process
4. Try generating a new App Password

### Forgot to copy the App Password?
- You'll need to generate a new one (old ones can't be viewed)
- Go back to App Passwords and generate a new one

## Security Notes

- ✅ App Passwords are safe to use - they only allow access to Gmail
- ✅ You can revoke App Passwords anytime from Google Account settings
- ✅ Never share your App Password
- ✅ If compromised, just generate a new one and revoke the old one

