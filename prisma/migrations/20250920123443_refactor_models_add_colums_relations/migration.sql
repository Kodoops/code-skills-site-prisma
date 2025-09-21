/*
  Warnings:

  - You are about to drop the column `videoKey` on the `Workshop` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Workshop` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `filekey` to the `Workshop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statement` to the `Workshop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Workshop` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('STUDENT', 'INSTRUCTOR', 'ADMIN', 'MODERATOR');

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Domain" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Enrollment" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."LearningPath" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Workshop" DROP COLUMN "videoKey",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "filekey" TEXT NOT NULL,
ADD COLUMN     "solutuion" TEXT,
ADD COLUMN     "solutuionFileKey" TEXT,
ADD COLUMN     "solutuionVideoKey" TEXT,
ADD COLUMN     "statement" TEXT NOT NULL,
ADD COLUMN     "statementVideoKey" TEXT,
ADD COLUMN     "statementsStartFileKey" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Lesson_chapterId_position_idx" ON "public"."Lesson"("chapterId", "position");

-- CreateIndex
CREATE INDEX "LessonProgress_userId_lessonId_idx" ON "public"."LessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "LessonProgress_userId_completed_idx" ON "public"."LessonProgress"("userId", "completed");

-- AddForeignKey
ALTER TABLE "public"."Workshop" ADD CONSTRAINT "Workshop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
