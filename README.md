# Withdrawal Sender - Telegram Mini App Platform

A complete full-stack Telegram Mini App platform for managing a coin-earning and rewards system. Features include a Telegram bot backend, React frontend mini app, and admin dashboard.

## Features

### 🤖 Telegram Bot Backend
- **Commands**: `/start`, `/app`, `/balance`, `/referral`, `/help`
- **Language Support**: English and Bengali
- **Channel Verification**: Force-join required channels before accessing the app
- **Referral System**: Automatic reward distribution for referrals
- **Webhook Handler**: Secure webhook integration with Telegram API

### 📱 Mini App Frontend
- **Dashboard**: User balance, level, and statistics
- **Tasks**: Daily and repeatable earning tasks
- **Spin Wheel**: Gamified coin rewards
- **Referral System**: Share links and track referrals
- **Withdrawals**: Multiple payment methods (Bkash, Nagad, Rocket, Bank, PayPal)
- **Leaderboard**: Top earners ranking
- **Promo Codes**: Redeem promotional codes for coins
- **Responsive Design**: Mobile-first UI optimized for Telegram

### 🛠️ Admin Panel
- **Users Management**: View and manage all users
- **Withdrawals**: Approve/reject withdrawal requests
- **Tasks**: Create and manage earning tasks
- **Channels**: Configure required channels
- **Settings**: Global platform configuration
- **Broadcast**: Send announcements to all users
- **Analytics**: Dashboard with key metrics

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, shadcn/ui
- **Backend**: Express.js, tRPC 11, Node.js
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth + Telegram WebApp SDK
- **Deployment**: Manus WebDev (Autoscale)

## Database Schema

21 tables covering:
- User management (telegram_users, users)
- Referral system (referrals)
- Withdrawals (withdrawals, payment_methods)
- Tasks (tasks, user_task_completion, ad_tasks, user_ad_task_completion)
- Channels (channels)
- Rewards (achievements, user_achievements, spin_wheel_entries, user_spin_history)
- Leaderboard (leaderboard)
- Promotions (promo_codes, user_promo_code_usage)
- Monetag Integration (monetag_accounts)
- Broadcasts (broadcasts)
- Logs (logs)
- Settings (settings)

## Environment Variables

```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
DATABASE_URL=mysql://user:password@host:port/database
APP_URL=https://yourdomain.com
```

## Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Type check
pnpm check
```

### Bot Commands

- `/start [referral_code]` - Register or login (with optional referral code)
- `/app` - Open the Mini App
- `/balance` - Check your balance
- `/referral` - Get your referral link
- `/help` - Show help message

### Admin Access

Access the admin panel at `/admin` (requires admin role).

## API Routes

### Telegram Webhook
- `POST /api/telegram/webhook` - Telegram bot webhook handler

### tRPC Procedures

#### Mini App
- `miniapp.getProfile` - Get user profile
- `miniapp.getTasks` - Get active tasks
- `miniapp.completeTask` - Complete a task
- `miniapp.getLeaderboard` - Get leaderboard
- `miniapp.getUserRank` - Get user's rank
- `miniapp.getPaymentMethods` - Get user's payment methods
- `miniapp.addPaymentMethod` - Add payment method
- `miniapp.requestWithdrawal` - Request withdrawal
- `miniapp.validatePromoCode` - Validate promo code
- `miniapp.spinWheel` - Spin the wheel

#### Admin
- `admin.getStats` - Get dashboard stats
- `admin.getUsers` - Get all users
- `admin.getPendingWithdrawals` - Get pending withdrawals
- `admin.approveWithdrawal` - Approve withdrawal
- `admin.rejectWithdrawal` - Reject withdrawal
- `admin.createTask` - Create task
- `admin.updateTask` - Update task
- `admin.getTasks` - Get all tasks
- `admin.createChannel` - Create channel
- `admin.getChannels` - Get all channels
- `admin.updateChannel` - Update channel
- `admin.getSettings` - Get settings
- `admin.updateSettings` - Update settings
- `admin.sendBroadcast` - Send broadcast message
- `admin.getBroadcasts` - Get broadcast history

## File Structure

```
withdrawal_sender/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── MiniApp.tsx
│   │   │   └── AdminPanel.tsx
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
├── server/
│   ├── telegram.ts
│   ├── db.ts
│   ├── routers/
│   │   ├── miniapp.ts
│   │   └── admin.ts
│   ├── routers.ts
│   └── _core/
├── drizzle/
│   ├── schema.ts
│   └── migrations/
├── shared/
└── package.json
```

## Deployment

### Publish to Manus

1. Create a checkpoint:
   ```bash
   webdev_save_checkpoint
   ```

2. Click the **Publish** button in the Management UI

3. Your app will be available at `https://xxx.manus.space`

4. Update `APP_URL` environment variable with the public URL

5. Telegram bot webhook will automatically register

## Testing

### Test Bot Commands

1. Start the bot: `/start`
2. Select language (English/Bengali)
3. Join required channels (if configured)
4. Open Mini App: `/app`
5. Check balance: `/balance`
6. Get referral link: `/referral`

### Test Admin Panel

1. Login with admin account
2. Navigate to `/admin`
3. Test each section (Users, Withdrawals, Tasks, Channels, Settings, Broadcast)

## Configuration

### Bot Settings

Edit settings via admin panel:
- `bot_name` - Display name of the bot
- `bot_username` - Telegram username (without @)
- `referral_reward` - Coins awarded for referrals
- `min_withdrawal` - Minimum withdrawal amount

### Payment Methods

Supported payment methods:
- Bkash
- Nagad
- Rocket
- Bank Transfer
- PayPal

## Security

- All admin operations require admin role
- Telegram data is validated via WebApp SDK
- Withdrawal requests are manually approved
- Channel membership is verified before access
- All sensitive data is encrypted in transit

## Support & Documentation

For more information, see:
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)

## License

MIT

## Author

Built with Manus AI
