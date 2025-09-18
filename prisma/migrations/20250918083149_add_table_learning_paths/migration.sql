/*
  Warnings:

  - You are about to drop the column `estimatedDuration` on the `LearningPath` table. All the data in the column will be lost.
  - You are about to drop the column `imageKey` on the `LearningPath` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripePriceId]` on the table `LearningPath` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duration` to the `LearningPath` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileKey` to the `LearningPath` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `LearningPath` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smallDescription` to the `LearningPath` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripePriceId` to the `LearningPath` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `LearningPath` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `level` on the `LearningPath` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."LearningPath" DROP COLUMN "estimatedDuration",
DROP COLUMN "imageKey",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "fileKey" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "smallDescription" TEXT NOT NULL,
ADD COLUMN     "stripePriceId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_stripePriceId_key" ON "public"."LearningPath"("stripePriceId");
