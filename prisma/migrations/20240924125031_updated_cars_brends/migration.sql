/*
  Warnings:

  - The `price` column on the `Car` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fuelType` column on the `Car` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `carType` column on the `Car` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CARD', 'TERMINAL', 'CASH');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "CarType" AS ENUM ('MANUAL', 'AUTOMATIC', 'ELECTRIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "MirorType" AS ENUM ('STANDARD', 'TINTED', 'ANTI_GLARE', 'HEATED', 'AUTO_DIMMING');

-- AlterTable
ALTER TABLE "Brend" ADD COLUMN     "payment" "PaymentType" NOT NULL DEFAULT 'CARD';

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "airConditioner" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "carBrend" TEXT NOT NULL DEFAULT 'MERCADES',
ADD COLUMN     "fuelEconomy" TEXT NOT NULL DEFAULT '10l/100km',
ADD COLUMN     "mirrorType" "MirorType" NOT NULL DEFAULT 'STANDARD',
DROP COLUMN "price",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL DEFAULT 180.00,
DROP COLUMN "fuelType",
ADD COLUMN     "fuelType" "FuelType" NOT NULL DEFAULT 'PETROL',
DROP COLUMN "carType",
ADD COLUMN     "carType" "CarType" NOT NULL DEFAULT 'MANUAL';

-- CreateIndex
CREATE INDEX "Car_brendId_idx" ON "Car"("brendId");

-- CreateIndex
CREATE INDEX "Car_carBrend_carType_fuelType_idx" ON "Car"("carBrend", "carType", "fuelType");
