-- CreateTable
CREATE TABLE `Movie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `coverPhoto` VARCHAR(191) NOT NULL,
    `subtitles` VARCHAR(191) NULL,
    `lengthTotal` INTEGER NOT NULL,
    `lengthIntro` INTEGER NOT NULL,
    `lengthCredits` INTEGER NOT NULL,
    `streamDomain` VARCHAR(191) NOT NULL,
    `streamPath` VARCHAR(191) NOT NULL,
    `streamTokens` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Movie_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
