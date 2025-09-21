/*
  Warnings:

  - You are about to drop the column `filekey` on the `Workshop` table. All the data in the column will be lost.
  - Added the required column `fileKey` to the `Workshop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Workshop" DROP COLUMN "filekey",
ADD COLUMN     "fileKey" TEXT NOT NULL,
ADD COLUMN     "stripePriceId" TEXT;
