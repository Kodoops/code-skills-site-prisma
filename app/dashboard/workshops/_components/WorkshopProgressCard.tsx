
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
import {SchoolIcon, TimerIcon} from "lucide-react";
import { WorkshopType} from "@/lib/types";

interface Props {
    data: WorkshopType
}

const WorkshopProgressCard = ({data}:Props) => {
    const thumbnailURl = useConstructUrl(data.fileKey);

    //const {totalLessons, progressPercentage, completedLessons} = useCourseProgress({courseData : data })

    return (
        <Card className={"group relative py-0 gap-0"}>
            <Badge className={"absolute top-2 right-2 bg-primary/40 text-primary z-10"}>
                {data.level}
            </Badge>
            <Image src={thumbnailURl} alt={data.title} width={600} height={400} className={"w-full rounded-t-xl aspect-video h-full object-cover"}/>
            <CardContent className={"p-4"}>
                <Link href={`/dashboard/workshops/${data.slug}`} className={"text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"}>
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

                    <div className="flex items-center gap-x-2">
                        <SchoolIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
                        <p className={"text-sm text-muted-foreground"}>{data.level}</p>
                    </div>
                </div>
                <div className="space-y-4 mt-5">
                    <div className="flex justify-between items-center mb-1 text-sm">
                        <p className={"text-sm text-muted-foreground"}>
                            Progress
                        </p>
                        {/*<p className="font-medium">{progressPercentage}%</p>*/}
                    </div>
                    {/*<Progress value={progressPercentage} className={"h-1.5"}/>*/}
                    {/*<p className={"text-xs text-muted-foreground mt-1"}  >*/}
                    {/*    {completedLessons} of {totalLessons} lessons completed*/}
                    {/*</p>*/}
                </div>

                <Link href={`/dashboard/workshops/${data.slug}`} className={buttonVariants({className: "w-full mt-4"})}>Follow Workshop</Link>

            </CardContent>
        </Card>
    );
};

export default WorkshopProgressCard;
