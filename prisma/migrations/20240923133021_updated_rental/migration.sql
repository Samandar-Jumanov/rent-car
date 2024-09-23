-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "address" TEXT NOT NULL DEFAULT 'Tashkent ',
ADD COLUMN     "driverLicence" TEXT NOT NULL DEFAULT '475864354',
ADD COLUMN     "userFatherName" TEXT NOT NULL DEFAULT 'users father name',
ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'Username';
