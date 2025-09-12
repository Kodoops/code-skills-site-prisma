-- CreateEnum
CREATE TYPE "public"."DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateTable
CREATE TABLE "public"."CoursePromotion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "discount" INTEGER NOT NULL,
    "type" "public"."DiscountType" NOT NULL DEFAULT 'PERCENTAGE',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "CoursePromotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discount" INTEGER NOT NULL,
    "type" "public"."DiscountType" NOT NULL DEFAULT 'PERCENTAGE',
    "usageLimit" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_CoursePromoCodes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CoursePromoCodes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "public"."PromoCode"("code");

-- CreateIndex
CREATE INDEX "_CoursePromoCodes_B_index" ON "public"."_CoursePromoCodes"("B");

-- AddForeignKey
ALTER TABLE "public"."CoursePromotion" ADD CONSTRAINT "CoursePromotion_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CoursePromoCodes" ADD CONSTRAINT "_CoursePromoCodes_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CoursePromoCodes" ADD CONSTRAINT "_CoursePromoCodes_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."PromoCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
