"use server";

import {ApiResponse} from "@/lib/types";
import {requireUser} from "@/app/data/user/require-user";
import {prisma} from "@/lib/db";
import {stripe} from "@/lib/stripe";
import Stripe from "stripe";
import {redirect} from "next/navigation";
import {env} from "@/lib/env";
import arcjet, {fixedWindow} from "@/lib/arcjet";
import {request} from "@arcjet/next";

const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    );

export async function enrollInCourseAction(courseId: string): Promise<ApiResponse | never> {

    const user = await requireUser();
    let checkoutUrl: string;

    try {

        const req = await request();
        const decision = await aj.protect(req, {fingerprint: user?.id as string});

        if (decision.isDenied()) {
            return {
                status: 'error',
                message: "you are blocked! , if you are human please try again in a minute or contact support",
            }
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            select: {
                id: true,
                title: true,
                price: true,
                slug: true,
            }
        });

        if (!course) {
            return {
                status: 'error',
                message: 'Course not found'
            }
        }
        let stripeCustomerId: string;
        const userWithStripeCustomerId = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                stripeCustomerId: true
            },
        });

        if (userWithStripeCustomerId?.stripeCustomerId) {
            stripeCustomerId = userWithStripeCustomerId?.stripeCustomerId;
        } else {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id,
                },
            });

            stripeCustomerId = customer.id;

            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    stripeCustomerId: stripeCustomerId,
                },
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
                    status: true,
                    id: true,
                }
            });

            if (existingEnrollment?.status === 'Active') {
                return {
                    status: 'success',
                    message: 'You are already enrolled in this course'
                }
            }

            let enrollment;
            if (existingEnrollment) {
                enrollment = await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id
                    },
                    data: {
                        amount: course.price,
                        status: 'Pending',
                        updatedAt: new Date(),
                    }
                });
            } else {
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        amount: course.price,
                        status: 'Pending',
                        updatedAt: new Date(),
                    }
                });
            }

            const checkoutSession = await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                line_items: [
                    {
                        price: 'price_1S3yXlGaRTmdClDrAEzbElZ3',
                        quantity: 1,
                    }
                ],
                mode: 'payment',
                success_url: `${env.BETTER_AUTH_URL}/payment/success`,
                cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
                metadata: {
                    userId: user.id,
                    courseId: course.id,
                    enrollmentId: enrollment.id,
                },
            });

            return {enrollment: enrollment, checkoutUrl: checkoutSession.url}
        });

        checkoutUrl = result.checkoutUrl as string;

    } catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
            console.log(error);
            return {
                status: 'error',
                message: 'Payment failed, please try again later',
            }
        }
        return {
            status: 'error',
            message: 'Something went wrong, Failed to enroll in course'
        }
    }

    redirect(checkoutUrl);
}
