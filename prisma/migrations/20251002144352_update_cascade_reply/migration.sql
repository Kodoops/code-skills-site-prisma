-- DropForeignKey
ALTER TABLE "public"."ContactReply" DROP CONSTRAINT "ContactReply_contactMessageId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ContactReply" ADD CONSTRAINT "ContactReply_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "public"."ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
