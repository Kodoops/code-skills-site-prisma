import React, {Suspense} from 'react';
import {notFound} from "next/navigation";
import {adminGetCourse} from "@/app/data/admin/admin-get-course";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import EditCourseForm from "@/app/admin/courses/[courseId]/edit/_components/EditCourseForm";
import CourseStructure from "@/app/admin/courses/[courseId]/edit/_components/CourseStructure";
import {getAllCategories} from "@/app/data/categories/get-all-categories";
import {AdminCategoryCardSkeleton} from "@/app/admin/categories/_components/AdminCategoryCard";
import {TagType} from "@/lib/types";
import {Ban} from "lucide-react";
import UpdateTagsList from "@/app/admin/courses/[courseId]/edit/_components/TagsLis";
import {adminGetAllTags} from "@/app/data/admin/admin-get-all-tags";
import { getLevels } from '@/app/data/get-levels';
import {getStatus} from "@/app/data/get-status";

type Params = Promise<{ courseId: string }>;

const Page = async ({params}: { params: Params }) => {

    const {courseId} = await params;
    if (!courseId) notFound();

    const data = await adminGetCourse(courseId);
    if (!data) notFound();

    const levels : string[] = await getLevels();
    const status: string[] = await getStatus();

    const catData = await getAllCategories();
    const categories = catData.map(category => ({
        id: category.id,
        title: category.title,
        slug: category.slug,
    }))

    return (
        <div>
            <h1 className={"text-xl font-bold mb-8"}>
                Edit Course : <span className={"text-primary underline"}>{data.title}</span>
            </h1>
            <Tabs defaultValue={"basic-info"} className={"w-full"}>
                <TabsList className={"grid grid-cols-3 w-full "}>
                    <TabsTrigger value={"basic-info"}>
                        Basic Infos
                    </TabsTrigger>
                    <TabsTrigger value={"course-structure"}>
                        Course Structure
                    </TabsTrigger>
                    <TabsTrigger value={"course-settings"}>
                        Course settings
                    </TabsTrigger>
                </TabsList>
                <TabsContent value={"basic-info"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Infos</CardTitle>
                            <CardDescription>
                                Provide basic information about the course.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditCourseForm data={data} categories={categories} levels={levels} status={status}/>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value={"course-structure"}>
                    <Card>
                        <CardHeader>
                            <CardTitle> Course Structure</CardTitle>
                            <CardDescription>
                                Here you can update your course structure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CourseStructure data={data}/>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value={"course-settings"}>
                    <Card>
                        <CardHeader>
                            <CardTitle> Course settings and options</CardTitle>
                            <CardDescription>
                                Here you can update your course options and settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className=" space-y-3">
                                <h2>Attached tags :</h2>
                                <Suspense fallback={<AdminTagCardSkeletonLayout />}>
                                    <RenderTags courseId={data.id} tags={data.tags.map(tag => ({...tag.tag}))} />
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


async function RenderTags({tags, courseId}:{tags: TagType [], courseId:string}) {

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
                        <p className="mt-2 mb-8 text-sm text-muted-foreground">No tags attached to this course.</p>
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
                <UpdateTagsList listTags={allTags} courseId={courseId} existingTags={tags}/>
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
