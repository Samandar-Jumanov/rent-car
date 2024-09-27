/*
  Warnings:

  - A unique constraint covering the columns `[discountId]` on the table `Discount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discountId` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountPercentage` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `startDate` on the `Discount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endDate` on the `Discount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Discount" ADD COLUMN     "discountId" TEXT NOT NULL,
ADD COLUMN     "discountPercentage" INTEGER NOT NULL,
DROP COLUMN "startDate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endDate",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Discount_discountId_key" ON "Discount"("discountId");
