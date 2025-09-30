import React, {useEffect, useState, useTransition} from 'react';
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
import {CheckIcon, Loader2, PlusIcon, SpaceIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import {learningPathItemSchema, LearningPathItemSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import { tryCatch } from '@/hooks/try-catch';
import { toast } from 'sonner';
import {adminGetCatalogue, createLearningPathItem } from '../actions';
import {LearningPathItemEnum, LearningPathItemType} from "@/lib/db/types";


export function NewLearningPathItem({learningPathId, contents, itemTypes }:
                                    {
                                        learningPathId: string,
                                        contents: LearningPathItemType[],
                                        itemTypes: string[]
                                    }
) {



    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition();
    const [type, setType] = useState<LearningPathItemEnum>()

    const [courses, setCourses] = useState<{ id:string, title:string }[]>([] );
    const [workshops, setWorkshops] = useState<{ id:string, title:string }[]>([] );
    const [resources, setResources] = useState<{ id:string, title:string }[]>([] );

    const form = useForm<LearningPathItemSchema>({
        resolver: zodResolver(learningPathItemSchema),
        defaultValues: {
            type: type,
            courseId: undefined,
            workshopId: undefined,
            resourceId: undefined,
            learningPathId: learningPathId,
        },
        mode: "onChange",
    })

    function handleOpenChange(open: boolean) {
        if (!open) {
            form.reset();
            setType(undefined);
        }
        setIsOpen(open)
    }

    async function onSubmit(values: LearningPathItemSchema) {

        startTransition(async () => {
            const {data: result, error} = await tryCatch(createLearningPathItem(values));

            if (error) {
                toast.error(error.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
                return;
            }
            if (result?.status === "success") {
                toast.success(result?.message, {
                    style: {
                        background: "#D1FAE5",
                        color: "#065F46",
                    },
                });
                form.reset();
                setType(undefined);
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

    useEffect(() => {
        (async () => {
            const result = await adminGetCatalogue();

            const usedCourseIds = contents
                .filter(item => item.courseId)
                .map(item => item.courseId);

            const usedWorkshopIds = contents
                .filter(item => item.workshopId)
                .map(item => item.workshopId);

            const usedResourceIds = contents
                .filter(item => item.resourceId)
                .map(item => item.resourceId);

            const filteredCourses = result.courses.filter(course => !usedCourseIds.includes(course.id));
            const filteredWorkshops = result.workshops.filter(workshop => !usedWorkshopIds.includes(workshop.id));
            const filteredResources = result.resources.filter(resource => !usedResourceIds.includes(resource.id));

            setCourses(filteredCourses);
            setWorkshops(filteredWorkshops);
            setResources(filteredResources);
        })();
    }, [contents]);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} size={"sm"} className={"gap-2"}>
                    <PlusIcon className={"size-4"}/> New Learning Path Item
                </Button>
            </DialogTrigger>
            <DialogContent title={"sm:maw-x-[425px"}>
                <DialogHeader>
                    <DialogTitle>
                        Create new Learning Path Item
                    </DialogTitle>
                    <DialogDescription>
                        What would you like to name this learning path item?
                    </DialogDescription>
                </DialogHeader>
                <Form {...form} >
                    <form className={"space-y-8"} onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="type"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Type of Item to add</FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setType(value as LearningPathItemEnum);
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Category"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {itemTypes.map((type, index) => (
                                                <SelectItem key={index} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {type && type=== 'Course' && <div className="">
                            <ScrollArea className="h-72 w-full rounded-md border">
                                <div className=" ">
                                    <h4 className="mb-4 text-sm leading-none font-semibold bg-muted-foreground/10 h-10
                                    flex items-center justify-center text-lg">
                                        Select a course
                                    </h4>
                                    <div className="">
                                        {courses.length > 0  ? courses?.map((item) => (
                                            <React.Fragment key={item.id}>
                                                <div
                                                    className={`text-sm px-4 cursor-pointer hover:text-primary flex items-center justify-start gap-2                                                
                                                    ${
                                                        form.watch("courseId") === item.id ? "text-primary font-semibold" : "text-muted-foreground"
                                                    }`}
                                                    onClick={() => {
                                                        form.setValue("courseId", item.id, {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                        });
                                                    }}
                                                >
                                                    {form.watch("courseId") === item.id ? <CheckIcon className={"size-4"} /> :<SpaceIcon className={"size-4"} /> }
                                                    {item.title}
                                                </div>
                                                <Separator className="my-2"/>
                                            </React.Fragment>
                                        ))
                                        : <div className="text-sm px-4 cursor-pointer hover:text-primary flex items-center justify-start gap-2">
                                                <SpaceIcon className={"size-4"} />
                                                No courses available
                                            </div>
                                        }

                                    </div>
                                </div>
                            </ScrollArea>
                        </div>}
                        {type && type=== 'Workshop' && <div className="">
                            <ScrollArea className="h-72 w-full rounded-md border">
                                <div className=" ">
                                    <h4 className="mb-4 text-sm leading-none font-semibold bg-muted-foreground/10 h-10
                                    flex items-center justify-center text-lg">
                                        Select a workshop
                                    </h4>
                                    <div className="">
                                        {workshops.length > 0  ? workshops?.map((item) => (
                                                <React.Fragment key={item.id}>
                                                    <div
                                                        className={`text-sm px-4 cursor-pointer hover:text-primary flex items-center justify-start gap-2                                                
                                                    ${
                                                            form.watch("workshopId") === item.id ? "text-primary font-semibold" : "text-muted-foreground"
                                                        }`}
                                                        onClick={() => {
                                                            form.setValue("workshopId", item.id, {
                                                                shouldValidate: true,
                                                                shouldDirty: true,
                                                            });
                                                        }}
                                                    >
                                                        {form.watch("workshopId") === item.id ? <CheckIcon className={"size-4"} /> :<SpaceIcon className={"size-4"} /> }
                                                        {item.title}
                                                    </div>
                                                    <Separator className="my-2"/>
                                                </React.Fragment>
                                            ))
                                            : <div className="text-sm px-4 cursor-pointer hover:text-primary flex items-center justify-start gap-2">
                                                <SpaceIcon className={"size-4"} />
                                                No workshop available
                                            </div>
                                        }

                                    </div>
                                </div>
                            </ScrollArea>
                        </div>}
                        {type && type=== 'Resource' && <div className="">
                            <ScrollArea className="h-72 w-full rounded-md border">
                                <div className=" ">
                                    <h4 className="mb-4 text-sm leading-none font-semibold bg-muted-foreground/10 h-10
                                    flex items-center justify-center text-lg">
                                        Select a resource
                                    </h4>
                                    <div className="">
                                        {resources.length > 0  ? resources?.map((item) => (
                                                <React.Fragment key={item.id}>
                                                    <div
                                                        className={`text-sm px-4 cursor-pointer hover:text-primary flex items-center justify-start gap-2                                                
                                                    ${
                                                            form.watch("resourceId") === item.id ? "text-primary font-semibold" : "text-muted-foreground"
                                                        }`}
                                                        onClick={() => {
                                                            form.setValue("resourceId", item.id, {
                                                                shouldValidate: true,
                                                                shouldDirty: true,
                                                            });
                                                        }}
                                                    >
                                                        {form.watch("resourceId") === item.id ? <CheckIcon className={"size-4"} /> :<SpaceIcon className={"size-4"} /> }
                                                        {item.title}
                                                    </div>
                                                    <Separator className="my-2"/>
                                                </React.Fragment>
                                            ))
                                            : <div className="text-sm px-4 cursor-pointer hover:text-primary flex items-center justify-start gap-2">
                                                <SpaceIcon className={"size-4"} />
                                                No resource available
                                            </div>
                                        }

                                    </div>
                                </div>
                            </ScrollArea>
                        </div>}
                        { ( type=== 'Course' && courses.length>0 || type=== 'Workshop' && workshops.length>0
                                || type=== 'Resource' && resources.length>0 )
                            && form.formState.isValid && <DialogFooter>
                            <Button type={"submit"} disabled={pending}>
                                {pending ? <>
                                    <Loader2 className={"size-4 animate-spin"}/> Saving ...
                                </> : <>
                                    Save changes
                                </>}
                            </Button>
                        </DialogFooter>}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

