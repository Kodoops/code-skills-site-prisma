"use client";

import React, {ReactNode, useEffect, useState} from 'react';
import {
    DndContext, DragEndEvent,
    DraggableSyntheticListeners,
    KeyboardSensor,
    PointerSensor,
    rectIntersection,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import {cn} from "@/lib/utils";
import {toast} from "sonner";
import {LearningPathType, levelBgColors, ResourceType, WorkshopType} from "@/lib/db/types";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible';
import {Button} from '@/components/ui/button';
import {ChevronDownIcon, ChevronRightIcon, GripVertical, SchoolIcon, TimerIcon} from 'lucide-react';
import {NewLearningPathItem} from "@/app/admin/learning-paths/[id]/edit/_components/NewLearningPathItem";
import {SimpleCourse} from "@/lib/db/models";
import {constructUrl} from "@/hooks/use-construct-url";
import {calculatedPrice} from "@/lib/price";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "@/components/custom-ui/ProductPrice";
import {reorderLearningPathItems} from "@/app/admin/learning-paths/[id]/edit/actions";
import {DeleteLearningPathItem} from "@/app/admin/learning-paths/[id]/edit/_components/DeleteLearningPathItem";

interface Props {
    data: LearningPathType,
    itemTypes: string[]
}

interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => ReactNode;
    className?: string;
}

const LearningPathStructure = ({data, itemTypes}: Props) => {

        const initialItems = data?.contents?.map((content) => (
            {
                id: content.id,
                type: content.type,
                order: content.position,
                course: content.course,
                workshop: content.workshop,
                resource: content.resource,
                isOpen: true, // default chapters to open
            }
        )) || [];

        const [items, setItems] = useState(initialItems);

        useEffect(() => {
            setItems((prevItems) => {
                const updatedItems = data?.contents.map((content) => ({
                    id: content.id,
                    type: content.type,
                    order: content.position,
                    course: content.course,
                    workshop: content.workshop,
                    resource: content.resource,
                    isOpen: prevItems.find((item) => item.id === content.id)?.isOpen ?? true, // default chapters to open
                })) || [];

                return updatedItems;
            });
        }, [data]);

        function SortableItem({children, id, className}: SortableItemProps) {
            const {
                attributes,
                listeners,
                setNodeRef,
                transform,
                transition,
                isDragging,
            } = useSortable({id: id, data: data});

            const style = {
                transform: CSS.Transform.toString(transform),
                transition,
            };

            return (
                <div ref={setNodeRef} style={style} {...attributes}
                     className={cn("touch-none", className, isDragging ? "z-10" : "")}>
                    {children(listeners)}
                </div>
            );
        }

        function handleDragEnd(event: DragEndEvent) {
            const {active, over} = event;

            if (!over || active.id === over.id) {
                return;
            }

            const activeId = active.id;
            const overId = over.id;
            const learningPathId = data?.id;

            let targetChapterId = null;
            targetChapterId = overId;

            if (!targetChapterId) {
                toast.error("Could not determine the learning path item for ordering",{
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    }
                });
                return;
            }

            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex((item) => item.id === targetChapterId);
            if (oldIndex === -1 || newIndex === -1) {
                toast.error("Could not determine the learning path item new/old index for ordering",{
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    }
                });
                return;
            }

            const reorderedLocalChapter = arrayMove(items, oldIndex, newIndex);
            const updatedChaptersForState = reorderedLocalChapter.map((chapter, index) => ({
                ...chapter,
                order: index + 1,
            }));

            const previousItems = [...items];

            setItems(updatedChaptersForState);

            if (learningPathId) {
                const chaptersToUpdate = updatedChaptersForState.map((chapter) => ({
                    id: chapter.id,
                    position: chapter.order,
                }));

                const reorderPromise = () => reorderLearningPathItems(learningPathId, chaptersToUpdate);

                toast.promise(reorderPromise(), {
                    loading: "Reordering learning path items",
                    success: (result) => {
                        if (result.status === "success") {
                            return {
                                message: result.message,
                                style: {
                                    background: "#D1FAE5",
                                    color: "#065F46",
                                },
                            }
                        }
                        throw new Error(result.message);
                    },
                    error: () => {
                        setItems(previousItems);
                        return {
                            message: "Failed to reorder learning path items",
                            style: {
                                background: "#FEE2E2",
                                color: "#991B1B",
                            }
                        };
                    },
                });
            }

            return;
        }

        function toggleChapter(chapterId: string) {
            setItems(
                items.map((chapter) => chapter.id === chapterId ? {...chapter, isOpen: !chapter.isOpen} : chapter)
            )
        }

        const sensors = useSensors(
            useSensor(PointerSensor),
            useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
            })
        );

        return (
            <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
                <Card>
                    <CardHeader className={"flex flex-row items-center justify-between border-b border-border"}>
                        <CardTitle>Content : </CardTitle>
                        {data && <NewLearningPathItem
                            learningPathId={data.id}
                            contents = {data.contents}
                            itemTypes = {itemTypes}
                        />}
                    </CardHeader>
                    <CardContent className={"space-y-4"}>
                        <SortableContext items={items} strategy={verticalListSortingStrategy}>
                            {items.map((item) => (
                                <SortableItem key={item.id} id={item.id}>
                                    {(listeners) => (
                                        <Card>
                                            <Collapsible open={item.isOpen} onOpenChange={() => toggleChapter(item.id)}>
                                                <div
                                                    className="flex items-center justify-between p-3 border-b border-border">
                                                    <div className="flex items-center gap-2">
                                                        <Button size={"icon"} variant={"ghost"}
                                                                {...listeners} >
                                                            <GripVertical className={"size-4"}/>
                                                        </Button>
                                                        <CollapsibleTrigger asChild>
                                                            <Button size={"icon"} variant={"ghost"}
                                                                    className={"flex items-center"}>
                                                                {item.isOpen ? <ChevronDownIcon className={"size-4"}/>
                                                                    : <ChevronRightIcon className={"size-4"}/>}
                                                            </Button>
                                                        </CollapsibleTrigger>
                                                        <p className={"cursor-pointer hover:text-primary pl-2"}>
                                                            {item.type} :
                                                            {item.type === 'Course'  && item.course?.title}
                                                            {item.type === 'Workshop'  && item.workshop?.title}
                                                            {item.type === 'Resource'  && item.resource?.title}
                                                        </p>
                                                    </div>
                                                    {data && <DeleteLearningPathItem itemId={item.id} learningPathId={data?.id}/>}
                                                </div>

                                                <CollapsibleContent className={"p-3"}>
                                                    {item.type === 'Course' && <CardItem data={item.course!}/>}
                                                    {item.type === 'Workshop' && <CardItem data={item.workshop!}/>}
                                                    {item.type === 'Resource' && <CardItem data={item.resource!}/>}
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </Card>
                                    )}
                                </SortableItem>
                            ))}
                        </SortableContext>
                    </CardContent>
                </Card>
            </DndContext>
        );
    }
;

export default LearningPathStructure;

const CardItem = ({data}: { data: SimpleCourse | WorkshopType | ResourceType}) => {
    const thumbnailURl = data.fileKey
        ? constructUrl(data.fileKey)
        : "";

    function isResource(
        obj: SimpleCourse | WorkshopType | ResourceType
    ): obj is ResourceType {
        return obj && !("price" in obj) && !("duration" in obj) && !("level" in obj);
    }

    const finalPrice = !isResource(data)
        ? calculatedPrice(data.price!, data?.promotions?.[0])
        : null;

    function isSimpleCourse(obj: any): obj is SimpleCourse {
        return obj && "smallDescription" in obj && "title" in obj;
    }

    return (
        <div className="group py-0 gap-0 flex flex-col md:flex-row">
            <div className="relative flex-2 ">
                {!isResource(data) && (
                    <Badge
                        className={cn(
                            "absolute top-2 right-2 text-foreground z-10",
                            levelBgColors[data.level] ?? "bg-accent"
                        )}
                    >
                        {data.level}
                    </Badge>
                )}
                <Image
                    src={thumbnailURl!}
                    alt={data.title}
                    width={600}
                    height={400}
                    className="w-full rounded-xl aspect-video object-cover"
                />
            </div>

            <div className="p-4 flex-3 flex flex-col">
                <div className="flex-1">
                    {!isResource(data) ? (
                        <Link
                            href={`/courses/${data.slug}`}
                            className="text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"
                        >
                            {data.title}
                        </Link>
                    ) : (
                        <span className="text-lg font-medium line-clamp-2">{data.title}</span>
                    )}

                    <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
                        {isSimpleCourse(data) ? data.smallDescription : data.description}
                    </p>
                </div>

                {!isResource(data) && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-x-5 ">
                            <div className="flex items-center gap-x-2">
                                <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                                <p className="text-sm text-muted-foreground">{data.duration}h</p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <SchoolIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                                <p className="text-sm text-muted-foreground">ICI CATEGORY / DOMAIN??</p>
                            </div>
                        </div>

                        <ProductPrice finalPrice={finalPrice!} price={data.price!} />
                    </div>
                )}
            </div>
        </div>
    );
};
