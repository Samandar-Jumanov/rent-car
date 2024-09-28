/*
  Warnings:

  - You are about to drop the column `requiresDelivery` on the `Rental` table. All the data in the column will be lost.
  - You are about to drop the column `requiresDriver` on the `Rental` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Rental" DROP COLUMN "requiresDelivery",
DROP COLUMN "requiresDriver";

-- AlterTable
ALTER TABLE "Requirements" ADD COLUMN     "rentalId" TEXT;

-- AddForeignKey
ALTER TABLE "Requirements" ADD CONSTRAINT "Requirements_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE CASCADE ON UPDATE CASCADE;
