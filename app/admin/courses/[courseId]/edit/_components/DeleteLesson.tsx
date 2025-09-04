import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {Loader2, Trash2Icon} from "lucide-react";
import React from 'react';
import {tryCatch} from "@/hooks/try-catch";
import {deleteLesson} from "@/app/admin/courses/[courseId]/edit/actions";
import {toast} from "sonner";


export function DeleteLesson({chapterId, courseId, lessonId}: { chapterId:string, courseId:string, lessonId: string}) {

    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition();

    async function onSubmit(){
        startTransition(async () => {
            const {data:result , error} = await tryCatch(deleteLesson(chapterId, courseId, lessonId))
            if(error){
                toast.error(error.message);
                return;
            }
            if(result?.status === "success"){
                toast.success(result?.message);
                setIsOpen(false);
            }else{
                toast.error(result?.message);
            }
        })
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                    <Trash2Icon className={"size-4"}/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. this will permanently delete the lesson.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <Button variant={"destructive"} onClick={onSubmit} disabled={pending}>
                        {pending ? <> <Loader2 className={"size-4"}/> Deleting ...</> : <>Delete</>}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

