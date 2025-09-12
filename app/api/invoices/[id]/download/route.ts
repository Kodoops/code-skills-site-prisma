// app/api/invoice/[id]/route.ts

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePdfDocument } from "@/app/dashboard/invoices/_components/invoice-document"

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const {id:invoiceId} =  await params;

    const company = await prisma.company.findFirst(); // ou byId si multi-tenant

    if (!company) {
        return new NextResponse("Informations de société manquantes", { status: 500 });
    }

    const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { items: true, user: true },
    });

    if (!invoice) {
        return new NextResponse("Facture non trouvée", { status: 404 });
    }

    // 📦 Génération du PDF
    const pdfBuffer = await renderToBuffer(InvoicePdfDocument({ invoice, company }));

    return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=facture-${invoice.number}.pdf`,
            "Content-Length": pdfBuffer.length.toString(),
        },
    });
}
