-- DropForeignKey
ALTER TABLE "public"."CourseTag" DROP CONSTRAINT "CourseTag_courseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LearningPathTag" DROP CONSTRAINT "LearningPathTag_learningPathId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkshopTag" DROP CONSTRAINT "WorkshopTag_workshopId_fkey";

-- AddForeignKey
ALTER TABLE "public"."CourseTag" ADD CONSTRAINT "CourseTag_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkshopTag" ADD CONSTRAINT "WorkshopTag_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "public"."Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningPathTag" ADD CONSTRAINT "LearningPathTag_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "public"."LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;
