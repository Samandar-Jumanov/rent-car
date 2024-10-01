/*
  Warnings:

  - You are about to drop the column `carBrend` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "carBrend",
DROP COLUMN "color";

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "carId" TEXT,
    "modelName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarBrend" (
    "id" TEXT NOT NULL,
    "carId" TEXT,
    "carBrend" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarBrend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarColor" (
    "id" TEXT NOT NULL,
    "carId" TEXT,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarColor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Model_carId_key" ON "Model"("carId");

-- CreateIndex
CREATE UNIQUE INDEX "CarBrend_carId_key" ON "CarBrend"("carId");

-- CreateIndex
CREATE UNIQUE INDEX "CarColor_carId_key" ON "CarColor"("carId");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarBrend" ADD CONSTRAINT "CarBrend_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarColor" ADD CONSTRAINT "CarColor_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
