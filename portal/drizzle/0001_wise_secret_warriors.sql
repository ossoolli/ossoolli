CREATE TABLE `automationJobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobKey` varchar(100) NOT NULL,
	`scheduleCronTaskUid` varchar(65),
	`cronExpression` varchar(80) NOT NULL,
	`enabled` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `automationJobs_id` PRIMARY KEY(`id`),
	CONSTRAINT `automation_jobs_key_uniq` UNIQUE(`jobKey`),
	CONSTRAINT `automation_jobs_task_uniq` UNIQUE(`scheduleCronTaskUid`)
);
--> statement-breakpoint
CREATE TABLE `escalationLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`paymentId` int NOT NULL,
	`stage` enum('friendly','notice','legal','eviction') NOT NULL,
	`actionTaken` text NOT NULL,
	`notes` text,
	`lawyerAssigned` varchar(255),
	`triggeredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `escalationLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`tenantId` int NOT NULL,
	`monthlyRent` decimal(10,2) NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`status` enum('active','ended','draft') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `owners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`phone` varchar(24),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `owners_id` PRIMARY KEY(`id`),
	CONSTRAINT `owners_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`tenantId` int NOT NULL,
	`leaseId` int,
	`amount` decimal(10,2) NOT NULL,
	`dueDate` date NOT NULL,
	`paidDate` timestamp,
	`transferredAt` timestamp,
	`status` enum('pending','paid','overdue') NOT NULL DEFAULT 'pending',
	`escalationStage` enum('normal','friendly','notice','legal','eviction') NOT NULL DEFAULT 'normal',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`propertyType` enum('apartment','villa','office','shop','building','other') NOT NULL,
	`governorate` varchar(100) NOT NULL,
	`address` text NOT NULL,
	`monthlyRent` decimal(10,2) NOT NULL,
	`dueDay` int NOT NULL DEFAULT 1,
	`status` enum('occupied','vacant','suspended') NOT NULL DEFAULT 'vacant',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`nationalId` varchar(50),
	`phone` varchar(24) NOT NULL,
	`riskScore` int NOT NULL DEFAULT 85,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tenants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `escalationLogs` ADD CONSTRAINT `escalationLogs_paymentId_payments_id_fk` FOREIGN KEY (`paymentId`) REFERENCES `payments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leases` ADD CONSTRAINT `leases_propertyId_properties_id_fk` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leases` ADD CONSTRAINT `leases_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `owners` ADD CONSTRAINT `owners_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_propertyId_properties_id_fk` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_leaseId_leases_id_fk` FOREIGN KEY (`leaseId`) REFERENCES `leases`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `properties` ADD CONSTRAINT `properties_ownerId_owners_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `owners`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tenants` ADD CONSTRAINT `tenants_propertyId_properties_id_fk` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `escalation_logs_payment_idx` ON `escalationLogs` (`paymentId`);--> statement-breakpoint
CREATE INDEX `leases_property_idx` ON `leases` (`propertyId`);--> statement-breakpoint
CREATE INDEX `leases_tenant_idx` ON `leases` (`tenantId`);--> statement-breakpoint
CREATE INDEX `payments_property_idx` ON `payments` (`propertyId`);--> statement-breakpoint
CREATE INDEX `payments_due_date_idx` ON `payments` (`dueDate`);--> statement-breakpoint
CREATE INDEX `payments_status_idx` ON `payments` (`status`);--> statement-breakpoint
CREATE INDEX `properties_owner_idx` ON `properties` (`ownerId`);--> statement-breakpoint
CREATE INDEX `tenants_property_idx` ON `tenants` (`propertyId`);