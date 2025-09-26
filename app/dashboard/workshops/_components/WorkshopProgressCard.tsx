
"use client";

import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {useConstructUrl} from "@/hooks/use-construct-url";
import Image from "next/image";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import { Badge } from '@/components/ui/badge';
import {useCourseProgress} from "@/hooks/use-course-progress";
import {Progress} from "@/components/ui/progress";
import { TimerIcon} from "lucide-react";
import { WorkshopType} from "@/lib/types";

interface Props {
    data: WorkshopType
}

const WorkshopProgressCard = ({data}:Props) => {
    const thumbnailURl = useConstructUrl(data.fileKey);

    const {totalLessons, progressPercentage, completedLessons} = useCourseProgress({courseData : data })
    return (
        <Card className={"group relative py-0 gap-0"}>
            <Badge className={"absolute top-2 right-2 bg-primary/40 text-primary z-10"}>
                {data.level}
            </Badge>
            <Image src={thumbnailURl} alt={data.title} width={600} height={400} className={"w-full rounded-t-xl aspect-video h-full object-cover"}/>
            <CardContent className={"p-4"}>
                <Link href={`/dashboard/courses/${data.slug}`} className={"text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"}>
                    {data.title}
                </Link>
                <p className={"line-clamp-2 text-sm text-muted-foreground leading-tight mt-2"}>
                    {data.description}
                </p>
                <div className="flex items-center gap-x-5 mt-4">
                    <div className="flex items-center gap-x-2">
                        <TimerIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
                        <p className={"text-sm text-muted-foreground"}>{data.duration}h</p>
                    </div>

                </div>
                <div className="space-y-4 mt-5">
                    <div className="flex justify-between items-center mb-1 text-sm">
                        <p className={"text-sm text-muted-foreground"}>
                            Progress
                        </p>
                        <p className="font-medium">{progressPercentage}%</p>
                    </div>
                    <Progress value={progressPercentage} className={"h-1.5"}/>
                    <p className={"text-xs text-muted-foreground mt-1"}  >
                        {completedLessons} of {totalLessons} lessons completed
                    </p>
                </div>

                <Link href={`/dashboard/workshops/${data.slug}`} className={buttonVariants({className: "w-full mt-4"})}>Learn More</Link>

            </CardContent>
        </Card>
    );
};

export default WorkshopProgressCard;


export function CourseProgressCardSkeleton() {
    return <Card className={"group relative py-0 gap-0"}>
        <div className={"absolute top-2 right-2 z-10 flex items-center gap-2"}>
            <Skeleton className={"h-6 w-20 rounded-full bg-muted-foreground/10"}/>
            <Skeleton className={"size-8 rounded-md  bg-muted-foreground/10"}/>
        </div>
        <div className={" w-full relative h-fit"}>
            <Skeleton className={"w-full rounded-t-lg aspect-video h-[250px] object-cover  bg-muted-foreground/10"}/>
        </div>
        <CardContent className={"p-4"}>
            <div className="space-y-2">
                <Skeleton className={"h-6 w-full  bg-muted-foreground/10 "}/>
                <Skeleton className={"w-3/4 h-6 "}/>
            </div>

            <div className="mt-4 flex items-center gap-x-5">
                <div className="flex items-center gap-x-2">
                    <Skeleton className={"size-6 rounded-md"}/>
                    <Skeleton className={"h-4 w-8 "}/>
                </div>
                <div className="flex items-center gap-x-2">
                    <Skeleton className={"size-6 rounded-md"}/>
                    <Skeleton className={"h-4 w-8 "}/>
                </div>
            </div>
            <Skeleton className={buttonVariants({className: "mt-4 h-10 w-full rounded"})}/>
        </CardContent>
    </Card>
}
