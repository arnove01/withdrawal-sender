# Railway Deployment Setup Guide

## Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Login" → "GitHub"
3. Authorize with your GitHub account

## Step 2: Deploy from GitHub
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select `withdrawal-sender` repository
4. Click "Deploy"

## Step 3: Configure Environment Variables
After Railway starts deploying, add these environment variables:

### Required Variables:
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token (from BotFather)
- `DATABASE_URL`: Your MySQL database URL
  - Format: `mysql://user:password@host:port/database`
  - You can use Railway's built-in MySQL plugin

### Optional but Recommended:
- `NODE_ENV`: Set to `production`
- `PORT`: Set to `3000` (Railway will automatically assign)

## Step 4: Add MySQL Database (Optional)
If you don't have a database yet:
1. In Railway project, click "Add Service"
2. Select "MySQL"
3. Railway will automatically create `DATABASE_URL` environment variable

## Step 5: Get Your Public URL
Once deployed:
1. Go to your Railway project
2. Click on the service
3. Copy the "Public URL" from the "Deployments" tab
4. This will be your `APP_URL` for the Telegram bot

## Step 6: Update Telegram Bot Webhook
Once you have the Railway URL:
1. Update `APP_URL` environment variable in Railway
2. The bot will automatically register the webhook

## Monitoring
- View logs: Click "View Logs" in Railway dashboard
- Check deployment status: "Deployments" tab
- Monitor resource usage: "Monitoring" tab

## Troubleshooting
- If deployment fails, check the build logs
- Ensure all environment variables are set
- Make sure DATABASE_URL is correct
- Check that TELEGRAM_BOT_TOKEN is valid

## 24/7 Operation
Railway's free tier keeps your app running 24/7 as long as:
- You have activity on the account
- The app doesn't exceed resource limits
- You don't exceed free tier quotas

For guaranteed 24/7 uptime, consider Railway's paid plans.
