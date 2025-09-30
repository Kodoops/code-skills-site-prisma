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
import {toast} from "sonner";
import { deleteQuestionOption } from "../actions";


export function DeleteQuestionOption({questionId, quizId, optionId}: { questionId:string, quizId:string, optionId: string}) {

    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition();

    async function onSubmit(){
        startTransition(async () => {
            const {data:result , error} = await tryCatch(deleteQuestionOption(questionId, questionId, optionId))
            if(error){
                toast.error(error.message,{
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
                return;
            }
            if(result?.status === "success"){
                toast.success(result?.message,  {
                    style: {
                        background: "#D1FAE5",
                        color: "#065F46",
                    },
                });
                setIsOpen(false);
            }else{
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
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className={"cursor-pointer"}>
                    <Trash2Icon className={"size-4"}/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. this will permanently delete the option of question.
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

