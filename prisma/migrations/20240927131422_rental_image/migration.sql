/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Requirements` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `value` to the `Requirements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "userImage" TEXT NOT NULL DEFAULT 'image';

-- AlterTable
ALTER TABLE "Requirements" ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Requirements_title_key" ON "Requirements"("title");
