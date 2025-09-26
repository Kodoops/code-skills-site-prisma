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
import {toast} from "sonner";
import {removeObjective, removeRequisite} from "@/app/admin/courses/[courseId]/edit/actions";

const DeleteBtnItemObjReq = ({courseId, type, item}:
                             {courseId:string, type:string, item:{content:string, id:string}}) => {
    return (
        <ConfirmationDialog type={type} id={item.id} courseId={courseId} />
    );
};

export default DeleteBtnItemObjReq;


export function ConfirmationDialog({type, id, courseId}:{type:string, id:string, courseId:string}) {

    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    function handleDeleteItem(){
        startTransition(async () => {
            if (type === 'Requisite') {
                await removeRequisite(id, courseId)
            } else {
                await removeObjective(id, courseId)
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

