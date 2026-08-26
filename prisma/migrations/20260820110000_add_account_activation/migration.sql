ALTER TABLE `User`
  ADD COLUMN `emailVerifiedAt` DATETIME(3) NULL,
  ADD COLUMN `activationToken` VARCHAR(191) NULL,
  ADD COLUMN `activationExpires` DATETIME(3) NULL,
  ADD COLUMN `passwordResetToken` VARCHAR(191) NULL,
  ADD COLUMN `passwordResetExpires` DATETIME(3) NULL,
  ADD UNIQUE INDEX `User_activationToken_key`(`activationToken`);
  
CREATE UNIQUE INDEX `User_passwordResetToken_key` ON `User`(`passwordResetToken`);
