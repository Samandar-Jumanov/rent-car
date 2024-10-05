/*
  Warnings:

  - You are about to drop the column `regionId` on the `Sessions` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `User` table. All the data in the column will be lost.
  - Added the required column `cityId` to the `Sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Sessions" DROP CONSTRAINT "Sessions_regionId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_regionId_fkey";

-- AlterTable
ALTER TABLE "Cities" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sessions" DROP COLUMN "regionId",
ADD COLUMN     "cityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "regionId",
ADD COLUMN     "cityId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "Cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "Cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
