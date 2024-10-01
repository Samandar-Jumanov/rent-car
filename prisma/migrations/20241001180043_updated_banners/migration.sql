/*
  Warnings:

  - Added the required column `choosenImage` to the `Banners` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Banners" DROP CONSTRAINT "Banners_id_fkey";

-- AlterTable
ALTER TABLE "Banners" ADD COLUMN     "choosenImage" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Banners" ADD CONSTRAINT "Banners_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
