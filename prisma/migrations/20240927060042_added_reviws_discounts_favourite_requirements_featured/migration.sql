/*
  Warnings:

  - The values [ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `airConditioner` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `carType` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `fuelEconomy` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `fuelType` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `mirrorType` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfSeats` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the `Brend` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('FREE', 'RENTED');

-- CreateEnum
CREATE TYPE "RentalType" AS ENUM ('NEW', 'ACCEPTED', 'DECLINED');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'AGENT', 'SUPER_ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Brend" DROP CONSTRAINT "Brend_userId_fkey";

-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_brendId_fkey";

-- DropForeignKey
ALTER TABLE "TopBrend" DROP CONSTRAINT "TopBrend_brendId_fkey";

-- DropIndex
DROP INDEX "Car_carBrend_carType_fuelType_idx";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "airConditioner",
DROP COLUMN "carType",
DROP COLUMN "fuelEconomy",
DROP COLUMN "fuelType",
DROP COLUMN "mirrorType",
DROP COLUMN "numberOfSeats",
ADD COLUMN     "discountedPrice" TEXT,
ADD COLUMN     "isDiscounted" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "status" "CarStatus" NOT NULL DEFAULT 'FREE';

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "status" "RentalType" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'Tashkent';

-- DropTable
DROP TABLE "Brend";

-- DropEnum
DROP TYPE "CarType";

-- DropEnum
DROP TYPE "FuelType";

-- DropEnum
DROP TYPE "MirorType";

-- CreateTable
CREATE TABLE "UserReviews" (
    "id" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserReviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "brendName" TEXT NOT NULL,
    "ownerNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "carDelivery" "CarDelivery" NOT NULL DEFAULT 'TAKE_AWAY',
    "topBrendId" TEXT,
    "payment" "PaymentType" NOT NULL DEFAULT 'CARD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarRewiew" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarRewiew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "upFrontMoney" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "carId" TEXT,
    "brendId" TEXT,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_ownerNumber_key" ON "Brand"("ownerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_carId_key" ON "Discount"("carId");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_brendId_key" ON "Discount"("brendId");

-- AddForeignKey
ALTER TABLE "UserReviews" ADD CONSTRAINT "UserReviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopBrend" ADD CONSTRAINT "TopBrend_brendId_fkey" FOREIGN KEY ("brendId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_brendId_fkey" FOREIGN KEY ("brendId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarRewiew" ADD CONSTRAINT "CarRewiew_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirements" ADD CONSTRAINT "Requirements_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_brendId_fkey" FOREIGN KEY ("brendId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
