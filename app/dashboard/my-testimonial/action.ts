import {prisma} from "@/lib/db/db";
import {requireUser} from "@/app/data/user/require-user";

export async function getUserTestimonial(){

    const user = await requireUser();

    const testimonial = await prisma.testimonial.findFirst({
        where: {
            userId: user.id
        },
        select:{
            id: true,
            createdAt: true,
            updatedAt: true,
            text: true,
            rating: true,
            userId: true,
        }
    })

    return  {
        ...testimonial,
        createdAt: testimonial?.createdAt.toISOString(),
        updatedAt: testimonial?.updatedAt.toISOString(),
    };
}
