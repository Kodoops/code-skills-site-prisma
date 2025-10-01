"use client";

import React, {useTransition} from 'react';
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {testimonialFormSchema, TestimonialFormSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {TestimonialType} from "@/lib/db/types";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {createOrUpdateTestimonial} from "@/app/dashboard/my-testimonial/action";

const TestimonialForm = ({testimonial} : {testimonial:TestimonialType | null}) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<TestimonialFormSchema>({
        resolver: zodResolver(testimonialFormSchema),
        defaultValues:{
            text: testimonial?.text ,
            rating: testimonial?.rating,
        }
    });

    async function onSubmit(values: TestimonialFormSchema) {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(createOrUpdateTestimonial(values));

            if (error) {
                toast.error(error.message,{
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
            if (result?.status === "success") {
                toast.success(result?.message,  {
                    style: {
                        background: "#D1FAE5",
                        color: "#065F46",
                    },
                });
                form.reset();
                router.push("/dashboard/my-testimonial");
            } else {
                toast.error(result?.message,{
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-lg mx-auto w-full"
            >
                {/* Note */}
                <FormField
                    control={form.control}
                    name="rating"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Note (1 à 5)</FormLabel>
                            <FormControl>
                                <Input type="number" min={1} max={5} {...field}  onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Avis */}
                <FormField
                    control={form.control}
                    name="text"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Avis</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Partage ton expérience..."
                                    rows={4}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    {testimonial?.userId ? "Mettre à jour" : "Enregistrer"}
                </Button>

            </form>
        </Form>
    );
};

export default TestimonialForm;
