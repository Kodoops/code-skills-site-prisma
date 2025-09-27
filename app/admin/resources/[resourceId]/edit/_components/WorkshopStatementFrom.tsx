"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import RichTextEditor from "@/components/rich-text-editor/Editor";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from 'sonner';
import { WorkshopType } from '@/lib/db/types';
import { updateWorkshopStatement } from "@/app/admin/workshops/[workshopId]/edit/actions";
import { workshopStatementSchema, WorkshopStatementSchema } from "@/lib/db/zodSchemas";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import Uploader from '@/components/file-uploader/Uploader';

interface Props {
    data: WorkshopType;
}

export function WorkshopStatementForm({ data }: Props) {
    const [pending, startTransition] = useTransition();
    const [inputMode, setInputMode] = useState<"file" | "url">(
       !data.statementsStartFileKey?.startsWith("http") ? "url" : "file"
    );

    const form = useForm<WorkshopStatementSchema>({
        resolver: zodResolver(workshopStatementSchema),
        defaultValues: {
            statement: data.statement ?? undefined,
            statementsStartFileKey: data.statementsStartFileKey ?? undefined,
            statementsStartFileUrl: data.statementsStartFileUrl ?? undefined,
            statementVideoKey: data.statementVideoKey ?? undefined,
        },
    });

    async function onSubmit(values: WorkshopStatementSchema) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(updateWorkshopStatement(values, data.id));
            if (error) {
                toast.error(error.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
                return;
            }

            if (result?.status === "success") {
                toast.success(result?.message,{
                    style: {
                        background: "#D1FAE5",
                        color: "#065F46",
                    },
                });
            } else {
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
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="statement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Statement (Describe your workshop...)</FormLabel>
                                        <FormControl>
                                            <RichTextEditor field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <RadioGroup
                                defaultValue={inputMode}
                                className="flex flex-row gap-4 mb-4"
                                onValueChange={(value: "file" | "url") => {
                                    setInputMode(value);
                                    form.setValue("statementsStartFileKey", undefined);
                                    form.setValue("statementsStartFileUrl", undefined);
                                }}
                            >
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <RadioGroupItem value="file" id="r1" />
                                    </FormControl>
                                    <FormLabel htmlFor="r1" className="cursor-pointer">Upload File</FormLabel>
                                </FormItem>

                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <RadioGroupItem value="url" id="r2" />
                                    </FormControl>
                                    <FormLabel htmlFor="r2" className="cursor-pointer">Provide URL</FormLabel>
                                </FormItem>
                            </RadioGroup>

                            <FormField
                                control={form.control}
                                name="statementsStartFileKey"
                                render={({ field }) => {
                                    if (inputMode !== "file") return <></>;
                                    return (
                                        <FormItem>
                                            <FormLabel>Statement Starter Kit File (Upload Starter File)</FormLabel>
                                            <FormControl>
                                                <Uploader
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                    fileTypeAccepted="file"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

                            <FormField
                                control={form.control}
                                name="statementsStartFileUrl"
                                render={({ field }) => {
                                    if (inputMode !== "url") return <></>;
                                    return (
                                        <FormItem>
                                            <FormLabel>Provide External Starter URL</FormLabel>
                                            <Input
                                                placeholder="ex: https://github.com/your-project/starter-kit"
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                type="url"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

                            <FormField
                                control={form.control}
                                name="statementVideoKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Statement Video File (video presentation if necessary)</FormLabel>
                                        <FormControl>
                                            <Uploader
                                                onChange={field.onChange}
                                                value={field.value}
                                                fileTypeAccepted="video"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={pending}>
                                {pending ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" /> Updating...
                                    </>
                                ) : (
                                    <>Update Workshop Statement</>
                                )}
                            </Button>
                        </form>
                    </Form>

    );
}
