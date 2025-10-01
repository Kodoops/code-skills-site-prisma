import {requireUser} from "@/app/data/user/require-user";
import {prisma} from "@/lib/db/db";
import {TestimonialType} from "@/lib/db/types";

export async function getUserTestimonial() : Promise<TestimonialType | null> {

    const user = await requireUser();

    const testimonial = await prisma.testimonial.findFirst({
        where: {
            userId: user.id
        },
        select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            text: true,
            rating: true,
            userId: true,
        }
    })

    if(!testimonial) return null;

    return {
        ...testimonial,
        createdAt: testimonial?.createdAt.toISOString(),
        updatedAt: testimonial?.updatedAt.toISOString(),
    };
}
