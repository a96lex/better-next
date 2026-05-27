-- AlterTable
ALTER TABLE "User" ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "email" DROP NOT NULL;
