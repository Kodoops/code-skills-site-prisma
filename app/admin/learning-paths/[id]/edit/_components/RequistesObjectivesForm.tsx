"use client";

import React, {useState, useTransition} from 'react';
import {PlusIcon} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {objectiveRequisiteSchema, ObjectiveRequisiteSchema} from "@/lib/zodSchemas";
import { useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {addObjectiveToLearningPath, addRequisiteToLearningPath} from "@/app/admin/learning-paths/[id]/edit/actions";
import {Form, FormControl, FormField, FormItem, FormMessage} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {Label} from "@/components/ui/label";

const RequisitesObjectivesForm = ({learningPathId, type}: {
    learningPathId: string,
    type: 'Requisite' | ' Objective'
}) => {

    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<ObjectiveRequisiteSchema>({
        resolver: zodResolver(objectiveRequisiteSchema),
        defaultValues: {
            content: "",
        },
    });

    const onSubmit = (values: ObjectiveRequisiteSchema) => {
        startTransition(async () => {
            if (type === 'Requisite') {
                await addRequisiteToLearningPath(learningPathId, values)
            } else {
                await addObjectiveToLearningPath(learningPathId, values)
            }
            form.reset({content: ""});
            setOpen(false)

            toast.success(`${type} added successfully`, {
                style: {
                    background: "#D1FAE5",
                    color: "#065F46",
                },
            });
        })
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <PlusIcon className="mr-2"/> Add new {type}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add a new {type}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-wrap gap-2 py-4 max-h-[300px] overflow-y-auto">
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">

                            <FormField
                                control={form.control}
                                name="content"
                                render={({field}) => (
                                    <FormItem>
                                        <Label>Title </Label>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ex: Maîtriser les bases de TypeScript"
                                                {...field}
                                                rows={3}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="flex justify-between pt-4">
                                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button disabled={isPending} type="submit">
                                    {isPending ? "Saving..." : `Add ${type}`}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>


            </DialogContent>
        </Dialog>
    );
};

export default RequisitesObjectivesForm;
