-- CreateEnum
CREATE TYPE "CarDelivery" AS ENUM ('TAKE_AWAY', 'DELIVER');

-- AlterTable
ALTER TABLE "Brend" ADD COLUMN     "carDelivery" "CarDelivery" NOT NULL DEFAULT 'TAKE_AWAY';
