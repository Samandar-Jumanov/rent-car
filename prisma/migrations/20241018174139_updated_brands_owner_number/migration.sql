/*
  Warnings:

  - A unique constraint covering the columns `[ownerNumber]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Brand_ownerNumber_key" ON "Brand"("ownerNumber");
