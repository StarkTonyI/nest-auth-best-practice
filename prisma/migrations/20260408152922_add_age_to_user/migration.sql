/*
  Warnings:

  - A unique constraint covering the columns `[identityId]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sessions_identityId_key" ON "sessions"("identityId");
