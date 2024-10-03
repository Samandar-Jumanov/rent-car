-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_brendId_fkey";

-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_carBrendId_fkey";

-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_colorId_fkey";

-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_modelId_fkey";

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_brendId_fkey" FOREIGN KEY ("brendId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "CarColor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carBrendId_fkey" FOREIGN KEY ("carBrendId") REFERENCES "CarBrend"("id") ON DELETE CASCADE ON UPDATE CASCADE;
