"use client"

import React, {useTransition} from 'react';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Loader2, PlusIcon, SparkleIcon} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {courseSchema, CourseSchema, quizSchema, QuizSchema} from "@/lib/db/zodSchemas";
import {type Resolver, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {notFound, useRouter} from "next/navigation";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import slugify from 'slugify';
import { QuizType} from '@/lib/db/types';
import {updateQuiz} from "@/app/admin/quiz/[quizId]/edit/actions";

interface EditQuizFormProps {
    data   :QuizType;
}

const EditQuizForm = ({data}:EditQuizFormProps) => {
    if (!data) notFound();

    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<QuizSchema>({
        resolver: zodResolver(quizSchema) as Resolver<QuizSchema>,
        defaultValues: {
            title: data.title,
            description: data.description,
            slug: data.slug,
        },
    })

    function onSubmit(values: QuizSchema) {
        startTransition(async () => {
            const {data:result , error} = await tryCatch(updateQuiz(values, data!.id));

            if (error) {
                toast.error(error.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
            if (result?.status === "success") {
                toast.success(result?.message,{
                    style: {
                        background: "#D1FAE5",
                        color: "#065F46",
                    },
                });
                form.reset();
                router.push("/admin/quiz");
            }else{
                toast.error(result?.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
        })
    }


    return (
        <Form {...form} >
            <form className={"space-y-6"}
                  onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 items-end ">
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({field}) => (
                            <FormItem className={"w-full"}>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="Slug" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type={"button"} className={"w-fit"}
                            onClick={() => {
                                const titleValue = form.getValues("title");
                                const slug = slugify(titleValue);
                                form.setValue('slug', slug, {shouldValidate: true});
                            }}>
                        Generate Slug <SparkleIcon className={"size-4 ml-1"}/>
                    </Button>
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem className={"w-full"}>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Description"
                                          className={"min-h-[120px]"}
                                          {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type={"submit"} disabled={pending}>
                    {pending ? (<>
                        Updating Quiz ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                    </> ) :(<>
                        Update Quiz <PlusIcon className={"size-4 ml-1"}/>
                    </>)}
                </Button>
            </form>
        </Form>
    );
};

export default EditQuizForm;
