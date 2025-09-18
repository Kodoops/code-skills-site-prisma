/*
  Warnings:

  - You are about to drop the column `url` on the `SocialLink` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."SocialLink" DROP COLUMN "url";

-- CreateTable
CREATE TABLE "public"."CompanySocialLink" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "socialLinkId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanySocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanySocialLink_companyId_socialLinkId_key" ON "public"."CompanySocialLink"("companyId", "socialLinkId");

-- AddForeignKey
ALTER TABLE "public"."CompanySocialLink" ADD CONSTRAINT "CompanySocialLink_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanySocialLink" ADD CONSTRAINT "CompanySocialLink_socialLinkId_fkey" FOREIGN KEY ("socialLinkId") REFERENCES "public"."SocialLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
