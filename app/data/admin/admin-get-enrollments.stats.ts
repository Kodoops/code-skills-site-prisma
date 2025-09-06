import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";

const NBR_DAYS = 30;

export async function adminGetEnrollmentsStats() {

    await requireAdmin();

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - NBR_DAYS);

    const enrollments = await prisma.enrollment.findMany({
        where: {
            createdAt: {
                gte: daysAgo,
            },
        },
        select: {
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc"
        },
    });

    const lastDays: { date: string, enrollments: number }[] = [];

    for (let i = NBR_DAYS -1 ; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        lastDays.push({
            date: date.toISOString().split("T")[0],
            enrollments: enrollments.filter(enrollment =>enrollment.createdAt.toISOString().split("T")[0] === date.toISOString().split("T")[0]).length,
        });
    }

    // enrollments.forEach((enrollment) => {
    //    const enrollmentDate = enrollment.createdAt.toISOString().split("T")[0];
    //    const dayIndex = lastDays.findIndex(day => day.date === enrollmentDate);
    //    if(dayIndex !== -1) {
    //        lastDays[dayIndex].enrollments++;
    //    }
    // });

    return lastDays;
}
