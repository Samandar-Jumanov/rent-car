/*
  Warnings:

  - You are about to drop the column `features` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `Car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "features",
DROP COLUMN "requirements";
