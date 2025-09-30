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
import {quizOptionSchema, QuizOptionSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from 'sonner';
import {Checkbox} from "@/components/ui/checkbox";
import {createQuizOption} from "@/app/admin/quiz/[quizId]/edit/actions";

export function NewQuestionOption({quizId, questionId}: { quizId: string , questionId: string}) {

    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition();

    const form = useForm<QuizOptionSchema>({
        resolver: zodResolver(quizOptionSchema),
        defaultValues: {
            content: "",
            isCorrect: false,
            questionId: questionId,
            quizId: quizId
        },
    })

    function handleOpenChange(open: boolean) {
        if (!open) {
            form.reset();
        }
        setIsOpen(open)
    }

    async function onSubmit(values: QuizOptionSchema) {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(createQuizOption(values));

            if (error) {
                toast.error(error.message,{
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
                return;
            }
            if (result?.status === "success") {
                toast.success(result?.message,  {
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
                <Button variant={"outline"}  className={"w-full justify-center gap-2"}>
                    <PlusIcon className={"size-4"}/> New Quiz Question Option
                </Button>
            </DialogTrigger>
            <DialogContent title={"sm:maw-x-[425px"}>
                <DialogHeader>
                    <DialogTitle>
                        Create new Quiz Question Option
                    </DialogTitle>
                    <DialogDescription>
                        What is the content of this Option?
                    </DialogDescription>
                </DialogHeader>
                <Form {...form} >
                    <form className={"space-y-8"} onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="content"
                            render={
                            ({field}) => (
                                <FormItem>
                                    <FormLabel>Content </FormLabel>
                                    <FormControl>
                                        <Input placeholder={"content of option"} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }/>
                        <FormField
                            control={form.control}
                            name="isCorrect"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel>It&apos;s a correct option  ?</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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

