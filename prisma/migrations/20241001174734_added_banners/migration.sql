-- CreateTable
CREATE TABLE "Banners" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Banners_carId_key" ON "Banners"("carId");

-- AddForeignKey
ALTER TABLE "Banners" ADD CONSTRAINT "Banners_id_fkey" FOREIGN KEY ("id") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
