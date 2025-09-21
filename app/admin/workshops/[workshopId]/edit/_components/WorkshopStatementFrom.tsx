"use client";

import React, {useTransition} from 'react';
import Link from 'next/link';
import {ArrowLeft, Loader2} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useForm} from "react-hook-form";

import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import RichTextEditor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploader/UploaderFull";
import {tryCatch} from "@/hooks/try-catch";
import { toast } from 'sonner';
import { WorkshopType } from '@/lib/types';
import {updateWorkshopStatement} from "@/app/admin/workshops/[workshopId]/edit/actions";
import {workshopStatementSchema, WorkshopStatementSchema} from "@/lib/zodSchemas";

interface Props {
    data: WorkshopType;
}

export function WorkshopStatementForm({data}: Props) {

    const [pending, startTransition] = useTransition();

    const form = useForm<WorkshopStatementSchema>({
        resolver: zodResolver(workshopStatementSchema),
        defaultValues: {
            statement: data.statement ?? undefined,
            statementVideoKey: data.statementVideoKey ?? undefined,
            statementsStartFileKey: data.statementsStartFileKey ?? undefined,

            solutionFileKey : data.solutionFileKey ?? undefined,
        },
    })

    async function onSubmit(values: WorkshopStatementSchema) {
        startTransition(async () => {
            const {data:result, error} = await tryCatch(updateWorkshopStatement(values, data.id ))
            if (error) {
                toast.error(error.message);
                return;
            }

            if(result?.status === "success"){
                toast.success(result?.message);
            }else{
                toast.error(result?.message);
            }
        });
    }

    return (
        <div className={""}>
            <Link href={`/admin/workshops/${data.id}/edit`}
                  className={buttonVariants({variant: "outline", className: "mb-6"})}>
                <ArrowLeft className={"size-4"}/> Go Back
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Workshop Statement Configuration</CardTitle>
                    <CardDescription>
                        Configure the video and other details of the workshop statement.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form  {...form}>
                        <form className={"space-y-6"} onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name={"statement"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Statement</FormLabel>
                                        <FormControl>
                                            <RichTextEditor field={field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"statementsStartFileKey"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Statement file resources </FormLabel>
                                        <FormControl>
                                            <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted={'image'} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={"solutionFileKey"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Solution file resources </FormLabel>
                                        <FormControl>
                                            <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted={'file'} multipleFiles={true} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"statementVideoKey"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Statement Video File</FormLabel>
                                        <FormControl>
                                            <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted={'video'} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button type={"submit"} disabled={pending}>
                                {pending ? <>
                                    <Loader2 className={"size-4 animate-spin"}/> Updating ...
                                </> : <>Update Workshop Statement</>}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

