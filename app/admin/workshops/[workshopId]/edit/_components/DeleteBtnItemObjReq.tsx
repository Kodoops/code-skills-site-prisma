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
import {removeObjective, removeRequisite} from "@/app/admin/workshops/[workshopId]/edit/actions";

const DeleteBtnItemObjReq = ({workshopId, type, item}:
                             {workshopId:string, type:string, item:{content:string, id:string}}) => {
    return (
        <ConfirmationDialog type={type} id={item.id} workshopId={workshopId} />
    );
};

export default DeleteBtnItemObjReq;


export function ConfirmationDialog({type, id, workshopId}:{type:string, id:string, workshopId:string}) {

    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    function handleDeleteItem(){
        startTransition(async () => {
            if (type === 'Requisite') {
                await removeRequisite(id, workshopId)
            } else {
                await removeObjective(id, workshopId)
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

