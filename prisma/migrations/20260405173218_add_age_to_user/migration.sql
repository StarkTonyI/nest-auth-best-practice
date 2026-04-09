/*
  Warnings:

  - You are about to drop the `identity_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "identity_roles" DROP CONSTRAINT "identity_roles_identityId_fkey";

-- DropForeignKey
ALTER TABLE "identity_roles" DROP CONSTRAINT "identity_roles_roleId_fkey";

-- DropTable
DROP TABLE "identity_roles";

-- DropTable
DROP TABLE "roles";
