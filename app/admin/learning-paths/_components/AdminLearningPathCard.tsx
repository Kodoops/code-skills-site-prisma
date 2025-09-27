"use client";

import React from "react";
import {MiniCard} from "@/app/(root)/learning-paths/_components/MiniCard";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button, buttonVariants} from "@/components/ui/button";
import CarouselGrid from "@/app/(root)/_components/CarouselGrid";
import {
    ArrowRightIcon,
    EyeIcon, FileArchive, FileTextIcon, ImageIcon, LinkIcon,
    MoreVerticalIcon,
    PencilIcon,
    SchoolIcon,
    TimerIcon,
    Trash2Icon,
    Youtube
} from "lucide-react";
import ProductPrice from "@/components/custom-ui/ProductPrice";
import {Skeleton} from "@/components/ui/skeleton";
import {calculatedPrice} from "@/lib/price";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {SimpleCourse} from "@/lib/db/models";
import {ResourceType, WorkshopType} from "@/lib/db/types";
import {useConstructUrl} from "@/hooks/use-construct-url";
import {Badge} from "@/components/ui/badge";

export default function AdminLearningPathCard({
                                                  data,
                                              }: {
    data: any;
}) {
    const finalPrice = calculatedPrice(data.price!, data?.promotions?.[0])

    const previewUrl = useConstructUrl(data.fileKey);

    const courses = data.contents
        .filter((c: any) => c.course !== null)
        .map((c: any) => c.course);

    const workshops = data.contents
        .filter((c: any) => c.workshop !== null)
        .map((c: any) => c.workshop);

    const resources = data.contents
        .filter((c: any) => c.resource !== null)
        .map((c: any) => c.resource);

    const renderIconFile = (type: string) =>{
        if(type === "video"){
            return  <Youtube className={"size-3"} />
        }
        if(type === "zip" || type === "tar" ){
            return  <FileArchive className={"size-3"} />
        }

        if(type === "link"  ){
            return  <LinkIcon className={"size-3"} />
        }

        if(type === "image"  ){
            return  <ImageIcon className={"size-3"} />
        }

        return <FileTextIcon className={"size-3"} />
    }

    return (
        <Card className="max-w-4xl mx-auto p-6 space-y-6 rounded-xl border shadow-md relative">
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"secondary"} size={"icon"}>
                            <MoreVerticalIcon className={"size-4"}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={"end"} className={"w-48"}>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/learning-paths/${data.id}/edit`}>
                                <PencilIcon className={"size-4 mr-2"}/>
                                Edit Learning Path
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/learning-paths/${data.slug}`}>
                                <EyeIcon className={"size-4 mr-2"}/>
                                Review Learning Path
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/learning-paths/${data.id}/delete`}>
                                <Trash2Icon className={"size-4 mr-2 text-destructive"}/>
                                Delete Learning Path
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Badge className={"absolute top-2 left-2"}
                   variant = {data.status=== 'Published' ?"default" : data.status=== 'Draft' ? "secondary" :  "destructive" }
            >
                {data.status}
            </Badge>
            <Image
                src={previewUrl}
                alt={data.title}
                className="max-w-full max-h-64 object-cover rounded-lg aspect-video"
                width={800}
                height={800}
            />
            <CardHeader>
                <CardTitle>
                    <h2 className="text-2xl font-bold">Parcours : {data.title}</h2>
                </CardTitle>
                <CardDescription>
                    <p className="text-muted-foreground">
                        {data.smallDescription}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-x-5 ">
                            <div className="flex items-center gap-x-2">
                                <TimerIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
                                <p className={"text-sm text-muted-foreground"}>{data.duration}h</p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <SchoolIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
                                <p className={"text-sm text-muted-foreground"}>ICI CATEGORY</p>
                            </div>
                        </div>

                        <ProductPrice finalPrice={finalPrice} price={data.price!}/>
                    </div>
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">

                <div>
                    <h3 className="text-lg font-semibold mb-3">Cours inclus  {courses && courses.length > 0 ? " (" + courses.length +") ": ""} </h3>
                    {courses && courses.length > 0 ? <CarouselGrid
                            items={courses}
                            perPage={2} // 2 par slide avec grid 2 colonnes
                            grid={{baseCols: 1, smCols: 2, lgCols: 2}}
                            renderItem={(course: SimpleCourse) => <MiniCard
                                title={course.title}
                                fileKey={course.fileKey}
                            />}
                            itemKey={(course: SimpleCourse) => course.id}
                            autoplayMs={0}
                        /> :
                        <p className="text-sm text-muted-foreground">
                            Aucun cours inclus pour le moment.
                        </p>
                    }
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Workshops {workshops && workshops.length > 0 ? " (" + workshops.length +") ": ""}</h3>
                    {workshops && workshops.length > 0 ? <CarouselGrid
                            items={workshops}
                            perPage={2} // 2 par slide
                            grid={{baseCols: 1, smCols: 2, lgCols: 2}}
                            renderItem={(workshop) => <MiniCard title={workshop.title} fileKey={workshop.fileKey}/>}
                            itemKey={(workshop: WorkshopType) => workshop.id}
                            autoplayMs={0}
                        /> :
                        <p className="text-sm text-muted-foreground">
                            Aucun atelier d&apos;inclus pour le moment.
                        </p>
                    }
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Ressources
                        complémentaires {resources && resources.length > 0 ? " (" + resources.length + ") " : ""}</h3>
                    <div className="flex items-start justify-start gap-4 text-sm text-muted-foreground space-y-1">
                        {resources && resources.length > 0 ? resources.map((res: ResourceType, i: number) => (
                                <div
                                    className={"flex items-center justify-center gap-2 border border-muted-foreground/10 p-2 rounded-lg bg-muted-foreground/10"}
                                    key={i + "-res"}>
                                    {renderIconFile(res.type)} {res.title}
                                </div>
                            )) :
                            <p className="text-sm text-muted-foreground">
                                Aucune ressources d&apos;inclus pour le moment.
                            </p>
                        }
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <Link href={`/admin/learning-paths/${data.id}/edit`}
                      className={cn(buttonVariants({className: "w-full"}))}
                >
                    Edit Learning Path <ArrowRightIcon className={"size-4"}/>
                </Link>
            </CardFooter>
        </Card>
    );
}


export function AdminLearningPathSkeletonCard() {
    return (
        <Card className="w-full  p-6 space-y-1 rounded-xl border shadow-md">
            <Skeleton className="max-w-full max-h-64 object-cover rounded-lg aspect-video bg-muted-foreground/10"/>
            <Skeleton className="max-w-full h-10 bg-muted-foreground/10"/>
            <div className="">
                <Skeleton className="max-w-full h-6 bg-muted-foreground/10"/>
                <Skeleton className="max-w-3/4 h-6 bg-muted-foreground/10"/>
            </div>
            <div className="flex items-center justify-between ">
                <div className="flex items-center gap-x-5">
                    <Skeleton className="w-24 h-6 bg-muted-foreground/10"/>
                    <Skeleton className="w-24 h-6 bg-muted-foreground/10"/>
                </div>
                <Skeleton className="w-32 h-6 bg-muted-foreground/10"/>
            </div>

            <Skeleton className="w-1/2 h-10 bg-muted-foreground/10"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="max-w-full max-h-24 object-cover rounded-lg aspect-video bg-muted-foreground/10"/>
                <Skeleton className="max-w-full max-h-24 object-cover rounded-lg aspect-video bg-muted-foreground/10"/>
            </div>

            <Skeleton className="w-1/2 h-10 bg-muted-foreground/10"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="max-w-full max-h-24 object-cover rounded-lg aspect-video bg-muted-foreground/10"/>
                <Skeleton className="max-w-full max-h-24 object-cover rounded-lg aspect-video bg-muted-foreground/10"/>
            </div>
            <div className="">
                <Skeleton className="w-3/4 h-10 bg-muted-foreground/10"/>
                <Skeleton className="w-1/2 h-6 bg-muted-foreground/10"/>
                <Skeleton className="w-1/4 h-6 bg-muted-foreground/10"/>
                <Skeleton className="w-3/4 h-6 bg-muted-foreground/10"/>
            </div>
            <Skeleton className="w-full h-10 bg-muted-foreground/10"/>
        </Card>
    )
}
