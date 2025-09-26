import React from 'react';
import {WorkshopType} from "@/lib/types";
import Image from "next/image";
import {IconBook, IconChartBar, IconClock} from "@tabler/icons-react";
import {Badge} from '@/components/ui/badge';
import {Separator} from "@/components/ui/separator";
import {Card, CardContent} from "@/components/ui/card";
import {CheckIcon} from 'lucide-react';
import ObjectivesAndRequisites from "@/app/dashboard/workshops/[slug]/_components/ObjectivesAndRequisites";

const WorkshopInformation = ({workshop}: { workshop: WorkshopType }) => {

    const prerequisites = workshop.prerequisites.length > 0 ? workshop.prerequisites.map(preq => {
        return {
            content: preq.prerequisite.content,
            id: preq.prerequisite.id,
        }
    }) : [];

    const objectives = workshop.objectives.length > 0 ? workshop.objectives.map(obj => {
        return {
            content: obj.objective.content,
            id: obj.objective.id,
        }
    }) : [];

    return (
        <>
            <div className={"grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5"}>
                <div className="order-1 lg:col-span-2">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                        <Image src={workshop.fileKey}
                               alt={workshop.title} fill className={"object-cover"}
                               priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                    <div className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <h1 className={"text-4xl font-bold tracking-tight"}>{workshop.title}</h1>
                            <p className={"text-lg text-muted-foreground leading-relaxed line-clamp-2"}>{workshop.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Badge className={"flex items-center gap-1 px-3 py-1"}>
                                <IconChartBar className={"size-4"}/>
                                <span>{workshop.level}</span>
                            </Badge>

                            <Badge className={"flex items-center gap-1 px-3 py-1"}>
                                <IconClock className={"size-4"}/>
                                <span>{workshop.duration} hours</span>
                            </Badge>
                        </div>

                        <Separator className={"my-8"}/>

                        <div className="space-y-6">
                            {workshop.tags.length > 0 && <div className=" flex flex-wrap gap-3 mt-4">
                                <span>Tags : </span>
                                {workshop.tags.map((tag, index) => (
                                    <Badge className={"flex items-center gap-1 px-3 py-1"} key={tag.tag.id}
                                           variant={"outline"}>
                                        {tag.tag.title}
                                    </Badge>
                                ))}
                            </div>}
                        </div>
                    </div>
                </div>

                {/* Enrollement Card*/}
                <div className="order-2 lg:col-span-1">
                    <div className="sticky top-20">
                        <Card className={"py-0"}>
                            <CardContent className={"p-6"}>

                                <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
                                    <h4 className={"font-medium"}>What you will get:</h4>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <IconClock className={"size-4"}/>
                                            </div>
                                            <div className="">
                                                <p className={"text-sm font-medium"}>Course Duration</p>
                                                <p className={"text-sm text-muted-foreground"}>{workshop.duration} hours </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <IconChartBar className={"size-4"}/>
                                            </div>
                                            <div className="">
                                                <p className={"text-sm font-medium"}>Difficulty Level</p>
                                                <p className={"text-sm text-muted-foreground"}>{workshop.level} </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <IconBook className={"size-4"}/>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6 space-Y-3 ">
                                    <h4>This course includes:</h4>
                                    <ul className={"space-y-2"}>
                                        <li className="flex items-center gap-2 text-sm">
                                            <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                                                <CheckIcon className={"size-3 "}/>
                                            </div>
                                            <span>
                                           Full lifetime access
                                       </span>
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                                                <CheckIcon className={"size-3 "}/>
                                            </div>
                                            <span>
                                          Access on mobile and desktop
                                       </span>
                                        </li>
                                        <li className="flex items-center gap-2 text-sm">
                                            <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                                                <CheckIcon className={"size-3 "}/>
                                            </div>
                                            <span>
                                          Certificate of completion
                                       </span>
                                        </li>
                                    </ul>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
            <div className="py-8">
                <ObjectivesAndRequisites requisites={prerequisites} objectives={objectives}/>
            </div>
        </>
    )
        ;
};

export default WorkshopInformation;
