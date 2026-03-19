-- AlterTable
ALTER TABLE "User" ALTER COLUMN "revoked" SET DEFAULT true;

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
