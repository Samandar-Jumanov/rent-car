/*
  Warnings:

  - A unique constraint covering the columns `[discountId]` on the table `Discount` will be added. If there are existing duplicate values, this will fail.
  - Made the column `discountId` on table `Discount` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Discount" ALTER COLUMN "discountId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Discount_discountId_key" ON "Discount"("discountId");
