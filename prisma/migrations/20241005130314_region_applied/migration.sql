/*
  Warnings:

  - You are about to drop the column `location` on the `Sessions` table. All the data in the column will be lost.
  - Added the required column `regionId` to the `Sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sessions" DROP COLUMN "location",
ADD COLUMN     "regionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "regionId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
