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
import {chapterSchema, ChapterSchema} from "@/lib/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {tryCatch} from "@/hooks/try-catch";
import {createChapter} from "@/app/admin/courses/[courseId]/edit/actions";
import {toast} from 'sonner';

export function NewChapterModal({courseId}: { courseId: string }) {

    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition();

    const form = useForm<ChapterSchema>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            title: "",
            courseId: courseId,
        },
    })

    function handleOpenChange(open: boolean) {
        if (!open) {
            form.reset();
        }
        setIsOpen(open)
    }

    async function onSubmit(values: ChapterSchema) {

        startTransition(async () => {
            const {data: result, error} = await tryCatch(createChapter(values));

            if (error) {
                toast.error(error.message);
                return;
            }
            if (result?.status === "success") {
                toast.success(result?.message);
                form.reset();
                setIsOpen(false);
            } else {
                toast.error(result?.message);
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} size={"sm"} className={"gap-2"}>
                    <PlusIcon className={"size-4"}/> New Chapter
                </Button>
            </DialogTrigger>
            <DialogContent title={"sm:maw-x-[425px"}>
                <DialogHeader>
                    <DialogTitle>
                        Create new chapter
                    </DialogTitle>
                    <DialogDescription>
                        What would you like to name this chapter?
                    </DialogDescription>
                </DialogHeader>
                <Form {...form} >
                    <form className={"space-y-8"} onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name={"title"} render={
                            ({field}) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder={"Chapter Name"} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }/>
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

