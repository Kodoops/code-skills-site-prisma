/*
  Warnings:

  - The `type` column on the `CoursePromotion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `PromoCode` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."CoursePromotion" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'PERCENTAGE';

-- AlterTable
ALTER TABLE "public"."PromoCode" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'PERCENTAGE';
