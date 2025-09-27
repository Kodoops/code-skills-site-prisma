"use client";

import React, {useTransition} from 'react';
import Link from 'next/link';
import {ArrowLeft, Loader2} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useForm} from "react-hook-form";
import { lessonSchema, LessonSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from "@/components/ui/input";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploader/Uploader";
import {updateLesson} from "@/app/admin/courses/[courseId]/[chapterId]/[lessonId]/actions";
import {tryCatch} from "@/hooks/try-catch";
import { toast } from 'sonner';
import {LessonType} from "@/lib/db/types";

interface Props {
    data: LessonType;
    chapterId: string;
    courseId: string;
}

export function LessonForm({data, chapterId, courseId}: Props) {

    const [pending, startTransition] = useTransition();

    const form = useForm<LessonSchema>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: data.title,
            chapterId: chapterId,
            courseId: courseId,
            description: data.description ?? undefined,
            videoKey: data.videoKey ?? undefined,
            thumbnailKey: data.thumbnailKey ?? undefined,

        },
    })

    async function onSubmit(values: LessonSchema) {
        startTransition(async () => {
            const {data:result, error} = await tryCatch(updateLesson(values, data.id ))
            if (error) {
                toast.error(error.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
                return;
            }

            if(result?.status === "success"){
                toast.success(result?.message, {
                    style: {
                        background: "#D1FAE5",
                        color: "#065F46",
                    },
                });
            }else{
                toast.error(result?.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
        });
    }

    return (
        <div className={""}>
            <Link href={`/admin/courses/${courseId}/edit`}
                  className={buttonVariants({variant: "outline", className: "mb-6"})}>
                <ArrowLeft className={"size-4"}/> Go Back
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Lesson Configuration</CardTitle>
                    <CardDescription>
                        Configure the video and other details of the lesson.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form  {...form}>
                        <form className={"space-y-6"} onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name={"title"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder={"Lesson title"} {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={"description"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <RichTextEditor field={field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"thumbnailKey"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Thumbnail Image </FormLabel>
                                        <FormControl>
                                            <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted={'image'} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"videoKey"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Video File</FormLabel>
                                        <FormControl>
                                            <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted={'video'} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button type={"submit"} disabled={pending}>
                                {pending ? <>
                                <Loader2 className={"size-4 animate-spin"}/> Saving ...
                                </> : <>Save Lesson</>}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

