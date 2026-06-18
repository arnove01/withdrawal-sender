# Withdrawal Sender - Telegram Mini App Platform

## Database & Schema
- [x] Design and implement complete database schema with all required tables
- [x] Create migrations for users, referrals, withdrawals, tasks, channels, settings, achievements, leaderboard, promo codes, ad tasks, monetag integration
- [x] Apply migrations to database

## Telegram Bot Backend
- [x] Implement webhook handler at /api/telegram/webhook
- [x] Implement /start command with language selection and referral code support
- [x] Implement /app command to open mini app
- [x] Implement /balance command to show user balance
- [x] Implement /referral command to share referral link
- [x] Implement /help command with all available commands
- [x] Implement force-join channel verification system
- [x] Implement user registration and creation on first interaction
- [x] Implement referral reward system
- [x] Implement callback query handlers for inline buttons

## Mini App Frontend
- [x] Set up React + Vite frontend at /app route
- [x] Integrate Telegram WebApp SDK
- [x] Implement user authentication via Telegram data
- [x] Create dashboard page showing user balance and stats
- [x] Implement tasks page for earning coins
- [x] Implement referral/invite friends page
- [x] Implement withdrawal page with payment method selection
- [x] Implement leaderboard page
- [ ] Implement achievements page
- [x] Implement spin wheel game mechanic
- [x] Implement promo code input
- [ ] Implement ad tasks integration
- [ ] Implement Monetag integration
- [x] Create responsive mobile-first design

## Admin Panel Dashboard
- [x] Create admin authentication and role-based access control
- [x] Implement sidebar navigation with 6 sections
- [x] Users management section
- [x] Withdrawals management section
- [x] Tasks management section
- [x] Channels management section
- [x] Settings management section
- [x] Broadcast messages section
- [x] Implement user list with search and filtering
- [x] Implement withdrawal approval/rejection workflow
- [x] Implement task creation and management
- [x] Implement channel configuration
- [x] Implement global settings editor
- [x] Implement broadcast message composer and sender
- [x] Implement analytics/dashboard overview

## User Features
- [ ] User registration on /start command
- [ ] Referral system with reward distribution
- [ ] Coin balance tracking
- [ ] User levels and progression
- [ ] Achievement system
- [ ] Leaderboard ranking
- [ ] Payment method management (saved accounts)
- [ ] Withdrawal requests and processing
- [ ] Promo code validation and application
- [ ] Ad task completion tracking
- [ ] Monetag integration for additional earnings
- [ ] Spin wheel game with coin rewards
- [ ] Language preference (English/Bengali)

## API Routes & Procedures
- [ ] POST /api/telegram/webhook - Telegram webhook handler
- [ ] GET /api/trpc/user.* - User data queries
- [ ] POST /api/trpc/user.* - User mutations
- [ ] GET /api/trpc/admin.* - Admin queries
- [ ] POST /api/trpc/admin.* - Admin mutations
- [ ] GET /api/trpc/leaderboard.* - Leaderboard data
- [ ] POST /api/trpc/withdrawal.* - Withdrawal management
- [ ] POST /api/trpc/task.* - Task management
- [ ] POST /api/trpc/promo.* - Promo code validation

## Environment & Configuration
- [x] Set up TELEGRAM_BOT_TOKEN environment variable
- [x] Set up DATABASE_URL environment variable
- [ ] Configure app URL for webhook registration (will be done after deployment)
- [x] Test webhook registration with Telegram API
- [ ] Configure CORS and security headers

## Testing & Deployment
- [ ] Test bot commands (/start, /app, /balance, /referral, /help)
- [ ] Test channel verification flow
- [ ] Test referral system and reward distribution
- [ ] Test mini app loading and Telegram SDK integration
- [ ] Test admin panel access and functionality
- [ ] Test withdrawal workflow
- [ ] Test all earning methods (tasks, spin, promo codes, monetag, ads)
- [ ] Create checkpoint and prepare for deployment
