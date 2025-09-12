import {headers} from "next/headers";
import Stripe from "stripe";
import {stripe} from "@/lib/stripe";
import {env} from "@/lib/env";
import {prisma} from "@/lib/db";

export async function POST(req: Request) {

    const body = await req.text();

    const headerList = await headers();

    const signature = headerList.get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            env.STRIPE_WEBHOOK_SECRET
        );
    } catch {
        return new Response('Webhook error', {
            status: 400
        });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const courseId = session.metadata?.courseId;
        const enrollmentId = session.metadata?.enrollmentId;
        const customerId = session.customer as string;
        if (!courseId || !enrollmentId) {
            return new Response("Missing Metadata : courseId or EnrollmentId", {
                status: 400
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                stripeCustomerId: customerId
            },
        });

        if (!user) {
            return new Response("User not found", {
                status: 400
            });
        }
        // ⚙️ Mise à jour de l'enrollment
        await prisma.enrollment.update({
            where: {
                id: enrollmentId,
            },
            data: {
                userId: user.id,
                courseId: courseId,
                status: 'Active',
                updatedAt: new Date(),
                amount: session.amount_total ?? 0,
            }
        });
        // ⚙️ Mise à jour du paiement associé
        await prisma.payment.updateMany({
            where: {
                stripeId: session.id,
            },
            data: {
                status: "succeeded",
                method: session.payment_method_types?.[0] ?? null,
                receiptUrl: (session as any).receipt_url ?? null, // dépend de la version de Stripe
            },
        });


        const invoiceNumber = `INV-${Date.now()}`;
        //  Appel correct à Stripe pour récupérer les lignes d'achat
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
            limit: 100,
        });
        await prisma.invoice.create({
            data: {
                number: invoiceNumber,
                userId: user.id,
                amount: session.amount_total as number,
                currency: session.currency ?? "EUR",
                items: {
                    create: lineItems.data.map((item) => ({
                        title: item.description ?? 'Article sans titre',
                        type: "COURSE", // ou "WORKSHOP", "SUBSCRIPTION", selon le metadata
                        referenceId: courseId,
                        quantity: item.quantity ?? 1,
                        unitPrice: item.amount_total ?? 0,
                        total: item.amount_total ?? 0,
                    })),
                },
            },
        });
    } else {
        await prisma.payment.updateMany({
            where: {
                stripeId: session.id,
            },
            data: {
                status: "failed",
                method: session.payment_method_types?.[0] ?? null,
                receiptUrl: (session as any).receipt_url ?? null, // dépend de la version de Stripe
            },
        });
    }

    return new Response(null, {
        status: 200
    });

}
