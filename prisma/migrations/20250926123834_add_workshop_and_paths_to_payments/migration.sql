-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "workshopId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "public"."Workshop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
