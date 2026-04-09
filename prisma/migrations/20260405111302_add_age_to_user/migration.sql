/*
  Warnings:

  - You are about to drop the column `createdAt` on the `identities` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `identities` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `identities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "identities" DROP COLUMN "createdAt",
DROP COLUMN "isVerified",
DROP COLUMN "updatedAt";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_roles" (
    "identityId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "identity_roles_pkey" PRIMARY KEY ("identityId","roleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- AddForeignKey
ALTER TABLE "identity_roles" ADD CONSTRAINT "identity_roles_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_roles" ADD CONSTRAINT "identity_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
