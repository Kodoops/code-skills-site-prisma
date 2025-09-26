/*
  Warnings:

  - A unique constraint covering the columns `[stripePriceId]` on the table `Workshop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "uq_workshop_stripePriceId" ON "public"."Workshop"("stripePriceId");

-- RenameIndex
ALTER INDEX "public"."Category_slug_key" RENAME TO "uq_category_slug";

-- RenameIndex
ALTER INDEX "public"."Course_slug_key" RENAME TO "uq_course_slug";

-- RenameIndex
ALTER INDEX "public"."Course_stripePriceId_key" RENAME TO "uq_course_stripePriceId";

-- RenameIndex
ALTER INDEX "public"."Domain_slug_key" RENAME TO "uq_domain_slug";

-- RenameIndex
ALTER INDEX "public"."Enrollment_paymentId_key" RENAME TO "uq_enrollment_payment";

-- RenameIndex
ALTER INDEX "public"."Feature_title_key" RENAME TO "uq_feature_title";

-- RenameIndex
ALTER INDEX "public"."LearningPath_slug_key" RENAME TO "uq_learningPath_slug";

-- RenameIndex
ALTER INDEX "public"."LearningPath_stripePriceId_key" RENAME TO "uq_learningPath_stripePriceId";

-- RenameIndex
ALTER INDEX "public"."LessonProgress_userId_lessonId_key" RENAME TO "uq_lessonProgress_user_lesson";

-- RenameIndex
ALTER INDEX "public"."Payment_stripeId_key" RENAME TO "uq_payment_stripeId";

-- RenameIndex
ALTER INDEX "public"."PromoCode_code_key" RENAME TO "uq_promocode_code";

-- RenameIndex
ALTER INDEX "public"."Tag_slug_key" RENAME TO "uq_tag_slug";

-- RenameIndex
ALTER INDEX "public"."Workshop_slug_key" RENAME TO "uq_workshop_slug";

-- RenameIndex
ALTER INDEX "public"."session_token_key" RENAME TO "uq_session_token";

-- RenameIndex
ALTER INDEX "public"."user_email_key" RENAME TO "uq_user_email";

-- RenameIndex
ALTER INDEX "public"."user_stripeCustomerId_key" RENAME TO "uq_user_stripeCustomerId";
