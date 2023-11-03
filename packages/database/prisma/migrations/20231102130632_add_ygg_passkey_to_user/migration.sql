/*
  Warnings:

  - A unique constraint covering the columns `[ygg_passkey]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ygg_passkey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_ygg_passkey_key" ON "users"("ygg_passkey");
