/*
  Warnings:

  - You are about to drop the column `solutuion` on the `Workshop` table. All the data in the column will be lost.
  - You are about to drop the column `solutuionFileKey` on the `Workshop` table. All the data in the column will be lost.
  - You are about to drop the column `solutuionVideoKey` on the `Workshop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Workshop" DROP COLUMN "solutuion",
DROP COLUMN "solutuionFileKey",
DROP COLUMN "solutuionVideoKey",
ADD COLUMN     "solution" TEXT,
ADD COLUMN     "solutionFileKey" TEXT,
ADD COLUMN     "solutionVideoKey" TEXT;
