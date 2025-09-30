import React, {useState, useTransition} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Loader2, PlusIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import { quizQuestionSchema, QuizQuestionSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from 'sonner';
import {createQuizQuestion} from "@/app/admin/quiz/[quizId]/edit/actions";

export function NewQuestionModal({quizId}: { quizId: string }) {

    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition();

    const quizQuestionTypes  = ["MULTIPLE_CHOICE", "TRUE_FALSE", "OPEN"]

    const form = useForm<QuizQuestionSchema>({
        resolver: zodResolver(quizQuestionSchema),
        defaultValues: {
            question: "",
            quizId: quizId,
            //type: "",
        },
    })

    function handleOpenChange(open: boolean) {
        if (!open) {
            form.reset();
        }
        setIsOpen(open)
    }

    async function onSubmit(values: QuizQuestionSchema) {

        startTransition(async () => {
            const {data: result, error} = await tryCatch(createQuizQuestion(values));

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
                toast.success(result?.message, {
                    style: {
                        background: "#D1FAE5",
                        color: "#065F46",
                    },
                });
                form.reset();
                setIsOpen(false);
            } else {
                toast.error(result?.message,{
                    style: {
                        background: "#FEE2E2",
                            color: "#991B1B",
                    },
                });
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} size={"sm"} className={"gap-2"}>
                    <PlusIcon className={"size-4"}/> New Quiz Question
                </Button>
            </DialogTrigger>
            <DialogContent title={"sm:maw-x-[425px"}>
                <DialogHeader>
                    <DialogTitle>
                        Create new quiz Question
                    </DialogTitle>
                    <DialogDescription>
                      Please enter the question information&apos;s below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form} >
                    <form className={"space-y-8"} onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name={"question"} render={
                            ({field}) => (
                                <FormItem>
                                    <FormLabel>Question</FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Your Question ..."} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }/>
                        {/*<FormField*/}
                        {/*    control={form.control}*/}
                        {/*    name="type"*/}
                        {/*    render={({field}) => (*/}
                        {/*        <FormItem className="w-full">*/}
                        {/*            <FormLabel>Question Type</FormLabel>*/}
                        {/*            <Select*/}
                        {/*                value={field.value}*/}
                        {/*                onValueChange={field.onChange}*/}
                        {/*            >*/}
                        {/*                <FormControl>*/}
                        {/*                    <SelectTrigger className="w-full">*/}
                        {/*                        <SelectValue placeholder="Select type of question ..."/>*/}
                        {/*                    </SelectTrigger>*/}
                        {/*                </FormControl>*/}
                        {/*                <SelectContent>*/}
                        {/*                    {quizQuestionTypes.map((type) => (*/}
                        {/*                        <SelectItem key={type} value={type}>*/}
                        {/*                            {type}*/}
                        {/*                        </SelectItem>*/}
                        {/*                    ))}*/}
                        {/*                </SelectContent>*/}
                        {/*            </Select>*/}
                        {/*            <FormMessage/>*/}
                        {/*        </FormItem>*/}
                        {/*    )}*/}
                        {/*/>*/}
                        <DialogFooter >
                            <Button type={"submit"} disabled={pending}>
                                {pending ? <>
                                    <Loader2 className={"size-4 animate-spin"}/> Saving ...
                                </> : <>
                                    Save changes
                                </>}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

