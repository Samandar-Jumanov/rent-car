/*
  Warnings:

  - You are about to drop the column `description` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `engineCapacity` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `enginePower` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `gearType` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `isTopRent` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `mileage` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfDoors` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `transmissionType` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Rental` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Rental` table. All the data in the column will be lost.
  - You are about to drop the column `userFatherName` on the `Rental` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `estimatedDistance` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passport` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupTime` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentalEnd` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentalStart` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnTime` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `travelRegion` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersFatherName` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_topBrendId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_userId_fkey";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "description",
DROP COLUMN "engineCapacity",
DROP COLUMN "enginePower",
DROP COLUMN "gearType",
DROP COLUMN "isTopRent",
DROP COLUMN "mileage",
DROP COLUMN "model",
DROP COLUMN "numberOfDoors",
DROP COLUMN "transmissionType",
DROP COLUMN "year",
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'title',
ALTER COLUMN "price" SET DEFAULT '180.00',
ALTER COLUMN "price" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Rental" DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "userFatherName",
ADD COLUMN     "estimatedDistance" TEXT NOT NULL,
ADD COLUMN     "passport" TEXT NOT NULL,
ADD COLUMN     "pickupTime" TEXT NOT NULL,
ADD COLUMN     "rentalEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "rentalStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "requiresDelivery" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresDriver" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "returnTime" TEXT NOT NULL,
ADD COLUMN     "travelRegion" TEXT NOT NULL,
ADD COLUMN     "usersFatherName" TEXT NOT NULL,
ALTER COLUMN "isActive" SET DEFAULT false,
ALTER COLUMN "address" DROP DEFAULT,
ALTER COLUMN "driverLicence" DROP DEFAULT,
ALTER COLUMN "username" DROP DEFAULT;

-- DropTable
DROP TABLE "Client";
