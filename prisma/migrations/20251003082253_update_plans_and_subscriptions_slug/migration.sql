/*
  Warnings:

  - Added the required column `slug` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SubscriptionPlan" ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "currencey" SET DEFAULT 'eur';
