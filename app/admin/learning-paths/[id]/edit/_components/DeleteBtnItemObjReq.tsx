"use client"

import React, {useState, useTransition} from 'react';
import {Trash2} from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {removeObjective, removeRequisite} from "@/app/admin/learning-paths/[id]/edit/actions";
import {toast} from "sonner";

const DeleteBtnItemObjReq = ({learningPathId, type, item}:
                             {learningPathId:string, type:string, item:{content:string, id:string}}) => {
    return (
        <ConfirmationDialog type={type} id={item.id} learningPathId={learningPathId} />
    );
};

export default DeleteBtnItemObjReq;


export function ConfirmationDialog({type, id, learningPathId}:{type:string, id:string, learningPathId:string}) {

    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    function handleDeleteItem(){
        startTransition(async () => {
            if (type === 'Requisite') {
                await removeRequisite(id, learningPathId)
            } else {
                await removeObjective(id, learningPathId)
            }

            setOpen(false)

            toast.success(`${type} removed successfully`, {
                style: {
                    background: "#D1FAE5",
                    color: "#065F46",
                },
            });
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="text-sm cursor-pointer" variant="destructive" size="icon">
                    <Trash2 className="text-desctructive size-4 "/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your {type}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteItem}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

