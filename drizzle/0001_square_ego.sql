CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(512),
	`requirement` int NOT NULL,
	`rewardCoins` bigint NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ad_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`reward` bigint NOT NULL,
	`adUrl` varchar(512) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ad_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `broadcasts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`message` text NOT NULL,
	`sentBy` int NOT NULL,
	`totalSent` int NOT NULL DEFAULT 0,
	`totalFailed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `broadcasts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `channels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`username` varchar(255) NOT NULL,
	`url` varchar(512),
	`type` enum('channel','group') NOT NULL DEFAULT 'channel',
	`isActive` boolean NOT NULL DEFAULT true,
	`isRequired` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `channels_id` PRIMARY KEY(`id`),
	CONSTRAINT `channels_username_unique` UNIQUE(`username`),
	CONSTRAINT `username_idx` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`rank` int NOT NULL,
	`totalCoins` bigint NOT NULL,
	`lastUpdatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderboard_id` PRIMARY KEY(`id`),
	CONSTRAINT `leaderboard_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `user_id_idx` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(255) NOT NULL,
	`details` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `monetag_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`monetagUserId` varchar(255) NOT NULL,
	`balance` decimal(10,2) NOT NULL DEFAULT '0',
	`lastSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `monetag_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `monetag_accounts_monetagUserId_unique` UNIQUE(`monetagUserId`),
	CONSTRAINT `monetag_user_id_idx` UNIQUE(`monetagUserId`)
);
--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('bkash','nagad','rocket','bank','paypal') NOT NULL,
	`accountNumber` varchar(255) NOT NULL,
	`accountName` varchar(255),
	`isDefault` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payment_methods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promo_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`reward` bigint NOT NULL,
	`maxUses` int,
	`currentUses` int NOT NULL DEFAULT 0,
	`expiresAt` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `promo_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `promo_codes_code_unique` UNIQUE(`code`),
	CONSTRAINT `code_idx` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerId` int NOT NULL,
	`referredUserId` int NOT NULL,
	`reward` bigint NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `spin_wheel_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` varchar(255) NOT NULL,
	`reward` bigint NOT NULL,
	`probability` decimal(5,2) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `spin_wheel_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`reward` bigint NOT NULL,
	`type` enum('daily','one_time','repeatable') NOT NULL DEFAULT 'daily',
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `telegram_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`telegramId` varchar(64) NOT NULL,
	`firstName` varchar(255),
	`lastName` varchar(255),
	`username` varchar(255),
	`language` enum('en','bn') NOT NULL DEFAULT 'en',
	`coins` bigint NOT NULL DEFAULT 0,
	`totalEarned` bigint NOT NULL DEFAULT 0,
	`level` int NOT NULL DEFAULT 1,
	`referralCode` varchar(16) NOT NULL,
	`referredBy` int,
	`referralCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `telegram_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `telegram_users_telegramId_unique` UNIQUE(`telegramId`),
	CONSTRAINT `telegram_users_referralCode_unique` UNIQUE(`referralCode`),
	CONSTRAINT `telegramId_idx` UNIQUE(`telegramId`),
	CONSTRAINT `referralCode_idx` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `user_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementId` int NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_ad_task_completion` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`adTaskId` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_ad_task_completion_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_promo_code_usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`promoCodeId` int NOT NULL,
	`usedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_promo_code_usage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_spin_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`spinWheelEntryId` int NOT NULL,
	`reward` bigint NOT NULL,
	`spunAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_spin_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_task_completion` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`taskId` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_task_completion_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `withdrawals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` bigint NOT NULL,
	`paymentMethodId` int NOT NULL,
	`status` enum('pending','approved','rejected','completed') NOT NULL DEFAULT 'pending',
	`transactionId` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `withdrawals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `openId_idx` UNIQUE(`openId`);--> statement-breakpoint
CREATE INDEX `active_idx` ON `ad_tasks` (`isActive`);--> statement-breakpoint
CREATE INDEX `sent_by_idx` ON `broadcasts` (`sentBy`);--> statement-breakpoint
CREATE INDEX `active_idx` ON `channels` (`isActive`);--> statement-breakpoint
CREATE INDEX `rank_idx` ON `leaderboard` (`rank`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `logs` (`userId`);--> statement-breakpoint
CREATE INDEX `action_idx` ON `logs` (`action`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `monetag_accounts` (`userId`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `payment_methods` (`userId`);--> statement-breakpoint
CREATE INDEX `active_idx` ON `promo_codes` (`isActive`);--> statement-breakpoint
CREATE INDEX `referrer_idx` ON `referrals` (`referrerId`);--> statement-breakpoint
CREATE INDEX `referred_idx` ON `referrals` (`referredUserId`);--> statement-breakpoint
CREATE INDEX `active_idx` ON `spin_wheel_entries` (`isActive`);--> statement-breakpoint
CREATE INDEX `active_idx` ON `tasks` (`isActive`);--> statement-breakpoint
CREATE INDEX `level_idx` ON `telegram_users` (`level`);--> statement-breakpoint
CREATE INDEX `coins_idx` ON `telegram_users` (`coins`);--> statement-breakpoint
CREATE INDEX `user_achievement_idx` ON `user_achievements` (`userId`,`achievementId`);--> statement-breakpoint
CREATE INDEX `user_ad_task_idx` ON `user_ad_task_completion` (`userId`,`adTaskId`);--> statement-breakpoint
CREATE INDEX `user_promo_idx` ON `user_promo_code_usage` (`userId`,`promoCodeId`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `user_spin_history` (`userId`);--> statement-breakpoint
CREATE INDEX `user_task_idx` ON `user_task_completion` (`userId`,`taskId`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `withdrawals` (`userId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `withdrawals` (`status`);