/*
  Warnings:

  - You are about to drop the column `username` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "profiles_username_key";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "username",
ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "ip",
DROP COLUMN "userAgent";

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userName_key" ON "profiles"("userName");
