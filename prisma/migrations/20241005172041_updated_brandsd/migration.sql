/*
  Warnings:

  - You are about to drop the column `address` on the `Brand` table. All the data in the column will be lost.
  - Added the required column `cityId` to the `Brand` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Brand_ownerNumber_key";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "address",
ADD COLUMN     "cityId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "Cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
