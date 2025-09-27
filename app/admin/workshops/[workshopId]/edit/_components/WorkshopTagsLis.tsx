"use client";

import React, {useState, useTransition} from 'react';
import {PlusIcon} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {TagType} from "@/lib/db/types";
import {toast} from "sonner";
import { updateWorkshopTags } from '../actions';

const WorkshopTagsList = ({listTags, workshopId, existingTags}:
                        { listTags: TagType[] | null, workshopId: string, existingTags: TagType [] }) => {

    const selection = existingTags.map(t => t.id)
    const [tags, setTags] = useState<TagType []>(existingTags) // fetched tags of the course
    const [allTags, setAllTags] = useState<TagType[] | null>(listTags) // fetched all tags
    const [selected, setSelected] = useState<string[]>(selection)
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleUpdate = () => {
        startTransition(async () => {
            await updateWorkshopTags(workshopId, selected)
            if (allTags !== null)
                setTags(allTags.filter(t => selected.includes(t.id)))
            setOpen(false)

            toast.success("Tags updated successfully",{
                style: {
                    background: "#D1FAE5",
                    color: "#065F46",
                },
            });
        })
    }

    const toggleTag = (tagId: string) => {
        setSelected(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon className="mr-2"/> Attach / Update Tags
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Update Workshop Tags</DialogTitle>
                </DialogHeader>

                <div className="flex flex-wrap gap-2 py-4 max-h-[300px] overflow-y-auto">
                    {allTags?.map(tag => {
                        const isSelected = selected.includes(tag.id)
                        return (
                            <Button
                                key={tag.id}
                                variant={isSelected ? "default" : "outline"}
                                className={`border ${isSelected ? "border-primary" : "border-muted"}`}
                                onClick={() => toggleTag(tag.id)}
                            >
                                {tag.title}
                            </Button>
                        )
                    })}
                </div>

                <DialogFooter className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} disabled={isPending}>
                        {isPending ? "Saving..." : "Update Tags"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default WorkshopTagsList;
