"use client";

import React, {useState, useTransition} from "react";
import {WorkshopType} from "@/lib/db/types";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import Uploader from "@/components/file-uploader/Uploader";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {useForm} from "react-hook-form";
import {
    workshopSolutionSchema,
    WorkshopSolutionSchema,
} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {updateWorkshopSolution} from "@/app/admin/workshops/[workshopId]/edit/actions";


const WorkshopSolution = ({data}: { data: WorkshopType }) => {

        const [pending, startTransition] = useTransition();
        const [inputMode, setInputMode] = useState<"file" | "url">(
            !data.solutionFileKey?.startsWith("http") ? "url" : "file"
        );

    console.log(data);

        const form = useForm<WorkshopSolutionSchema>({
            resolver: zodResolver(workshopSolutionSchema),
            defaultValues: {
                solution: data.solution ?? undefined,
                solutionFileKey: data.solutionFileKey ?? undefined,
                solutionFileUrl: data.solutionFileUrl ?? undefined,
                solutionVideoKey: data.solutionVideoKey ?? undefined,
            },
        });

        async function onSubmit(values: WorkshopSolutionSchema) {
            startTransition(async () => {
                const {data: result, error} = await tryCatch(updateWorkshopSolution(values, data.id));
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
                    toast.error(result?.message,  {
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
                        name="solution"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Solution (Describe your solution workshop...)</FormLabel>
                                <FormControl>
                                    <RichTextEditor field={field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <RadioGroup
                        defaultValue={inputMode}
                        className="flex flex-row gap-4 mb-4"
                        onValueChange={(value: "file" | "url") => {
                            setInputMode(value);
                            form.setValue("solutionFileKey", undefined);
                            form.setValue("solutionFileUrl", undefined);
                        }}
                    >
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <RadioGroupItem value="file" id="r1"/>
                            </FormControl>
                            <FormLabel htmlFor="r1" className="cursor-pointer">Upload Solution File</FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <RadioGroupItem value="url" id="r2"/>
                            </FormControl>
                            <FormLabel htmlFor="r2" className="cursor-pointer">Provide solution URL</FormLabel>
                        </FormItem>
                    </RadioGroup>

                    <FormField
                        control={form.control}
                        name="solutionFileKey"
                        render={({field}) => {
                            if (inputMode !== "file") return <></>;
                            return (
                                <FormItem>
                                    <FormLabel>Solution File (Upload solution file)</FormLabel>
                                    <FormControl>
                                        <Uploader
                                            onChange={field.onChange}
                                            value={field.value}
                                            fileTypeAccepted="file"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="solutionFileUrl"
                        render={({field}) => {
                            if (inputMode !== "url") return <></>;
                            return (
                                <FormItem>
                                    <FormLabel>Provide External Solution URL</FormLabel>
                                    <Input
                                        placeholder="ex: https://github.com/your-project/solution-x"
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        type="url"
                                    />
                                    <FormMessage/>
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="solutionVideoKey"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Solution Video File (video solution if necessary)</FormLabel>
                                <FormControl>
                                    <Uploader
                                        onChange={field.onChange}
                                        value={field.value}
                                        fileTypeAccepted="video"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={pending}>
                        {pending ? (
                            <>
                                <Loader2 className="size-4 animate-spin"/> Updating...
                            </>
                        ) : (
                            <>Update Workshop Solution</>
                        )}
                    </Button>
                </form>
            </Form>
        );
    }
;

export default WorkshopSolution;
