/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `surname` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_carId_fkey";

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "driverLicenceImages" TEXT[],
ADD COLUMN     "passportImages" TEXT[],
ADD COLUMN     "surname" TEXT NOT NULL;

-- DropTable
DROP TABLE "Image";
