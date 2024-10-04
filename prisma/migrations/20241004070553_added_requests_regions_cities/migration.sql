-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('DEMAND', 'PROPOSAL');

-- CreateTable
CREATE TABLE "Requests" (
    "id" TEXT NOT NULL,
    "type" "RequestType" NOT NULL DEFAULT 'DEMAND',
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "Cities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Regions_name_key" ON "Regions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Cities_name_key" ON "Cities"("name");

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cities" ADD CONSTRAINT "Cities_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
