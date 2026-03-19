/*
  Warnings:

  - A unique constraint covering the columns `[authId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profile_authId_key" ON "Profile"("authId");
