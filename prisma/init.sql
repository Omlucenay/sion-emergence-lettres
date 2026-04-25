-- CreateTable
CREATE TABLE `Submission` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(40) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `formData` TEXT NOT NULL,
    `signatureSvg` MEDIUMTEXT NULL,
    `signatureName` VARCHAR(120) NULL,
    `signedAt` DATETIME(3) NULL,
    `signerIp` VARCHAR(64) NULL,
    `signerUa` VARCHAR(500) NULL,
    `pdfHash` VARCHAR(64) NULL,
    `pdfPath` VARCHAR(500) NULL,
    `acceptRgpd` BOOLEAN NOT NULL DEFAULT false,
    `acceptTerms` BOOLEAN NOT NULL DEFAULT false,
    `signerEmail` VARCHAR(180) NOT NULL,
    `emailSentAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Submission_type_idx`(`type`),
    INDEX `Submission_status_idx`(`status`),
    INDEX `Submission_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

