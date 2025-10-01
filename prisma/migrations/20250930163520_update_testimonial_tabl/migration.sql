/*
  Warnings:

  - You are about to drop the column `name` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Testimonial` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Testimonial" DROP COLUMN "name",
DROP COLUMN "role";
