/*
  Warnings:

  - Added the required column `brandId` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "brandId" TEXT NOT NULL,
ADD COLUMN     "isReturned" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
