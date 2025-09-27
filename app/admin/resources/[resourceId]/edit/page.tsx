import React, {Suspense} from 'react';
import {notFound} from "next/navigation";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {AdminCategoryCardSkeleton} from "@/app/admin/categories/_components/AdminCategoryCard";
import {TagType} from "@/lib/db/types";
import {ArrowLeft, Ban} from "lucide-react";
import {adminGetAllTags} from "@/app/data/admin/admin-get-all-tags";
import { getLevels } from '@/app/data/get-levels';
import {getStatus} from "@/app/data/get-status";
import { adminGetWorkshop } from '@/app/data/admin/admin-get-workshop';
import EditWorkshopForm from "@/app/admin/workshops/[workshopId]/edit/_components/EditWorkshopForm";
import WorkshopStatement from './_components/WorkshopStatement';
import WorkshopSolution from "@/app/admin/workshops/[workshopId]/edit/_components/WorkshopSolution";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import WorkshopTagsLis from "@/app/admin/workshops/[workshopId]/edit/_components/WorkshopTagsLis";

type Params = Promise<{ workshopId: string }>;

const Page = async ({params}: { params: Params }) => {

    const {workshopId} = await params;
    if (!workshopId) notFound();

    const data = await adminGetWorkshop(workshopId);
    if (!data) notFound();

    const levels : string[] = await getLevels();
    const status: string[] = await getStatus();

    return (
        <div>
            <h1 className={"text-xl font-bold mb-8"}>
                Edit Workshop : <span className={"text-primary underline"}>{data.title}</span>
            </h1>
            <div className="">
                <Link href={`/admin/workshops`}  className={buttonVariants({className: "mb-6"})} >
                    <ArrowLeft className={"size-4"} /> Go back
                </Link>
            </div>
            <Tabs defaultValue={"basic-info"} className={"w-full"}>
                <TabsList className={"grid grid-cols-4 w-full "}>
                    <TabsTrigger value={"basic-info"}>
                        Basic Infos
                    </TabsTrigger>
                    <TabsTrigger value={"workshop-statement"}>
                        Workshop Statement
                    </TabsTrigger>
                    <TabsTrigger value={"workshop-solution"}>
                        Workshop Solution
                    </TabsTrigger>
                    <TabsTrigger value={"workshop-settings"}>
                        Workshop settings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={"basic-info"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Infos </CardTitle>

                            <CardDescription>
                                Provide basic information about the workshop.
                            </CardDescription>

                        </CardHeader>
                        <CardContent>
                            <EditWorkshopForm data={data} levels={levels} status={status}/>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value={"workshop-statement"}>
                    <Card>
                        <CardHeader>
                            <CardTitle> Workshop Statement</CardTitle>
                            <CardDescription>
                                Here you can update your workshop statement.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <WorkshopStatement data={data}/>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value={"workshop-solution"}>
                    <Card>
                        <CardHeader>
                            <CardTitle> Workshop Solution</CardTitle>
                            <CardDescription>
                                Here you can check wortkshop solution.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <WorkshopSolution data={data}/>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value={"workshop-settings"}>
                    <Card>
                        <CardHeader>
                            <CardTitle> Workshop settings and options</CardTitle>
                            <CardDescription>
                                Here you can update your workshop options and settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className=" space-y-3">
                                <h2>Attached tags :</h2>
                                <Suspense fallback={<AdminTagCardSkeletonLayout />}>
                                    <RenderTags workshopId={data.id} tags={data.tags.map(tag => ({...tag.tag}))} />
                                </Suspense>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Page;


async function RenderTags({tags, workshopId}:{tags: TagType [], workshopId:string}) {

    const allTags = await adminGetAllTags();

    return (
        <>
            <div>
                {!tags || tags.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center h-full p-8 text-center border rounded-md border-dashed">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                            <Ban className="w-10 h-10 text-primary"/>
                        </div>
                        <p className="mt-2 mb-8 text-sm text-muted-foreground">No tags attached to this workshop.</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, index) => (
                            <Card
                                key={tag.id + index}
                                className={`border border-border px-4 py-2 rounded-md bg-primary text-muted`}
                            >
                                {tag.title}
                            </Card>
                        ))}
                    </div>
                )
                }
                <WorkshopTagsLis listTags={allTags} workshopId={workshopId} existingTags={tags}/>
            </div>

        </>
    )
}

function AdminTagCardSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
            {Array.from({length: 4}).map((_, index) => (
                <AdminCategoryCardSkeleton key={index}/>
            ))}
        </div>
    )
}
