"use client";

import React, {useState, useTransition} from 'react';
import { PlusIcon} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {TagItem} from "@/lib/types";
import { updateCourseTags } from '../actions';

const UpdateTagsList =  ({listTags, courseId, existingTags}:{listTags:TagItem[], courseId:string, existingTags:TagItem[]}) => {

     const [tags, setTags] = useState<TagItem[]>(existingTags) // fetched tags of the course
    const [allTags, setAllTags] = useState<TagItem[]>(listTags) // fetched all tags
    const [selected, setSelected] = useState<string[]>([])
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleUpdate = () => {
        startTransition(async () => {
            await updateCourseTags(courseId, selected)
            setTags(allTags.filter(t => selected.includes(t.id)))
            setOpen(false)
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
                    <DialogTitle>Update Course Tags</DialogTitle>
                </DialogHeader>

                <div className="flex flex-wrap gap-2 py-4 max-h-[300px] overflow-y-auto">
                    {allTags.map(tag => {
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

export default UpdateTagsList;
