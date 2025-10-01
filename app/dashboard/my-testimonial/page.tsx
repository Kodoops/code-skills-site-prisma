import {Card} from "@/components/ui/card";
import TestimonialForm from "@/app/dashboard/my-testimonial/_components/TestimonialForm";
import { getUserTestimonial } from "@/app/data/user/get-user-testimonial";


const MyTestimonialPage = async () => {

    const testimonial = await getUserTestimonial();

    return (

        <>
            <div className="flex flex-col gap-2 mt-4">
                <h1 className={"text-3xl font-bold"}>My Testimonial</h1>
                <p className={"text-muted-foreground"}>
                    Here you can see your testimonial and  update it.
                </p>
            </div>
            <Card className=" w-full my-6">
                <TestimonialForm testimonial={testimonial} />
            </Card>
        </>
    );
};

export default MyTestimonialPage;
