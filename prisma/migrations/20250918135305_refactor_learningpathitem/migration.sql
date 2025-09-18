/*
  Warnings:

  - You are about to drop the column `itemId` on the `LearningPathItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."LearningPathItem" DROP CONSTRAINT "fk_course_item";

-- DropForeignKey
ALTER TABLE "public"."LearningPathItem" DROP CONSTRAINT "fk_resource_item";

-- DropForeignKey
ALTER TABLE "public"."LearningPathItem" DROP CONSTRAINT "fk_workshop_item";

-- AlterTable
ALTER TABLE "public"."LearningPathItem" DROP COLUMN "itemId",
ADD COLUMN     "courseId" TEXT,
ADD COLUMN     "resourceId" TEXT,
ADD COLUMN     "workshopId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."LearningPathItem" ADD CONSTRAINT "fk_course_item" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningPathItem" ADD CONSTRAINT "fk_workshop_item" FOREIGN KEY ("workshopId") REFERENCES "public"."Workshop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningPathItem" ADD CONSTRAINT "fk_resource_item" FOREIGN KEY ("resourceId") REFERENCES "public"."Resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
