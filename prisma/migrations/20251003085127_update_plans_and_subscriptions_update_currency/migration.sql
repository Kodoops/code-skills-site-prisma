/*
  Warnings:

  - You are about to drop the column `currencey` on the `SubscriptionPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."SubscriptionPlan" DROP COLUMN "currencey",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'eur';
