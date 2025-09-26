"use server";

import {ApiResponseType} from "@/lib/types";
import {requireUser} from "@/app/data/user/require-user";
import {prisma} from "@/lib/db";
import {stripe} from "@/lib/stripe";
import Stripe from "stripe";
import {redirect} from "next/navigation";
import {env} from "@/lib/env";
import arcjet, {fixedWindow} from "@/lib/arcjet";
import {request} from "@arcjet/next";
import {calculatedPrice} from "@/lib/price";

const aj = arcjet.withRule(
    fixedWindow({
        mode: "LIVE",
        window: "1m",
        max: 5,
    })
);

export async function enrollInCourseAction(courseId: string): Promise<ApiResponseType | never> {
    const user = await requireUser();
    let checkoutUrl: string;

    try {
        const req = await request();
        const decision = await aj.protect(req, {fingerprint: user?.id as string});

        if (decision.isDenied()) {
            return {
                status: "error",
                message: "Vous avez été temporairement bloqué. Réessayez dans une minute ou contactez le support.",
            };
        }

        const course = await prisma.course.findUnique({
            where: {id: courseId},
            select: {
                id: true,
                title: true,
                price: true,
                slug: true,
                stripePriceId: true,
                promotions: {
                    where: {
                        active: true,
                        startsAt: {lte: new Date()},
                        endsAt: {gte: new Date()},
                    },
                    orderBy: {
                        startsAt: "desc", // la plus récente
                    },
                    take: 1, // une seule promo par course
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        discount: true,
                        type: true,
                        startsAt: true,
                        endsAt: true,
                        active: true,
                        courseId: true
                    },
                },
            }

        });

        if (!course) {
            return {status: "error", message: "Cours introuvable."};
        }

        //Calcul price with promotion
        const priceToPay = calculatedPrice(course.price, course.promotions[0]);


        // 🔍 Stripe Customer
        let stripeCustomerId: string;
        const userWithStripeCustomerId = await prisma.user.findUnique({
            where: {id: user.id},
            select: {stripeCustomerId: true},
        });

        if (userWithStripeCustomerId?.stripeCustomerId) {
            stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
        } else {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {userId: user.id},
            });

            stripeCustomerId = customer.id;

            await prisma.user.update({
                where: {id: user.id},
                data: {stripeCustomerId},
            });
        }

        const result = await prisma.$transaction(async (tx) => {
            const existingEnrollment = await tx.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: courseId,
                    },
                },
                select: {
                    id: true,
                    status: true,
                },
            });

            let enrollment;
            if (existingEnrollment?.status === "Active") {
                return {
                    status: "success",
                    message: "Vous êtes déjà inscrit à ce cours.",
                };
            }

            if (existingEnrollment) {
                enrollment = await tx.enrollment.update({
                    where: {id: existingEnrollment.id},
                    data: {
                        amount: priceToPay,
                        status: "Pending",
                        updatedAt: new Date(),
                    },
                });
            } else {
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        amount: priceToPay,
                        status: "Pending",
                    },
                });
            }

            const checkoutSession = await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                line_items: [
                    {
                        // price: course.stripePriceId,
                        // quantity: 1,

                        price_data: {
                            currency: 'eur',
                            product_data: {
                                name: course.title,
                            },
                            unit_amount: priceToPay, // Prix remisé, en centimes
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `${env.BETTER_AUTH_URL}/payment/success`,
                cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
                metadata: {
                    userId: user.id,
                    courseId: course.id,
                    enrollmentId: enrollment.id,
                    referenceId: course.id,
                    type: "COURSE"
                },
            });


            // ✅ Création du Payment associé à l'enrollment
            const payment = await tx.payment.create({
                data: {
                    stripeId: checkoutSession.id,
                    userId: user.id,
                    courseId: course.id,
                    amount: priceToPay,
                    currency: checkoutSession.currency ?? "usd",
                    status: "pending",
                    method: null,
                    receiptUrl: null,
                    //enrollmentId: enrollment.id
                },
            });

            // 🔗 Lier le payment à l'enrollment (via le champ `paymentId`)
            await tx.enrollment.update({
                where: {id: enrollment.id},
                data: {
                    payment: {
                        connect: {id: payment.id},
                    },
                },
            });

            return {
                enrollment,
                checkoutUrl: checkoutSession.url,
            };
        });

        checkoutUrl = result.checkoutUrl as string;
    } catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
            console.log(error)
            return {
                status: "error",
                message: "Échec du paiement. Veuillez réessayer.",
            };
        }

        console.error("Enrollment failed:", error);

        return {
            status: "error",
            message: "Une erreur est survenue lors de l'inscription au cours.",
        };
    }

    redirect(checkoutUrl);
}
