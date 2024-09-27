-- DropIndex
DROP INDEX "Discount_discountId_key";

-- AlterTable
ALTER TABLE "Discount" ALTER COLUMN "discountId" DROP NOT NULL;
