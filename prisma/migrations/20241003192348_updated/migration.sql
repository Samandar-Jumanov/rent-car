/*
  Warnings:

  - A unique constraint covering the columns `[blockedUserId]` on the table `BlockedUsers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[carBrend]` on the table `CarBrend` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[color]` on the table `CarColor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[modelName]` on the table `Model` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BlockedUsers_blockedUserId_key" ON "BlockedUsers"("blockedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "CarBrend_carBrend_key" ON "CarBrend"("carBrend");

-- CreateIndex
CREATE UNIQUE INDEX "CarColor_color_key" ON "CarColor"("color");

-- CreateIndex
CREATE UNIQUE INDEX "Model_modelName_key" ON "Model"("modelName");
