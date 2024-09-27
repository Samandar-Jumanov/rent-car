/*
  Warnings:

  - You are about to drop the `CarRewiew` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CarRewiew" DROP CONSTRAINT "CarRewiew_carId_fkey";

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "averageRating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ratings" INTEGER[] DEFAULT ARRAY[0]::INTEGER[];

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "averageRating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ratings" INTEGER[] DEFAULT ARRAY[0]::INTEGER[];

-- DropTable
DROP TABLE "CarRewiew";

-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL,
    "carId" TEXT,
    "brandId" TEXT,
    "userId" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
