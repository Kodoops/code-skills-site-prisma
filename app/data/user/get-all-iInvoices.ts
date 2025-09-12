import { InvoiceItem } from "@/lib/types";
import {requireUser} from "@/app/data/user/require-user";
import {prisma} from "@/lib/db";
import {DateTime} from "@/lib/date-time";

type PaginatedInvoices = {
    data: InvoiceItem[];
    totalPages: number;
    currentPage: number;
    perPage: number;
};

export async function getAllUserInvoices(page: number = 1, perPage:number=9): Promise<PaginatedInvoices> {
    const user = await requireUser();

    const skip = (page - 1) * perPage;

    const [rawData, totalCount] = await Promise.all([
        prisma.invoice.findMany({
            where: {
                userId: user.id,
            },
            orderBy: { date: 'desc' },
            skip,
            take: perPage,
            select: {
                id: true,
                number: true,
                userId: true,
                amount: true,
                currency: true,
                pdfUrl: true,
                date: true,
                createdAt: true,
                items: {
                    select: {
                        id: true,
                        invoiceId: true,
                        title: true,
                        type: true,
                        referenceId: true,
                        quantity: true,
                        unitPrice: true,
                        total: true,
                    },
                },
            },
        }),
        prisma.invoice.count({
            where: {
                userId: user.id,
            },
        }),
    ]);

    const data: InvoiceItem[] = rawData.map((invoice) => ({
        id: invoice.id,
        number: invoice.number,
        userId: invoice.userId,
        amount: invoice.amount,
        currency: invoice.currency,
        pdfUrl: invoice.pdfUrl ?? undefined,
        date: DateTime.fromJSDate(invoice.date).toISO(),
        createdAt: DateTime.fromJSDate(invoice.createdAt).toISO(),
        items: invoice.items.map((item) => ({
            id: item.id,
            invoiceId: item.invoiceId,
            title: item.title,
            type: String(item.type),
            referenceId: item.referenceId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
        })),
    }));

    return {
        data,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        perPage
    };
}
