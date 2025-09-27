import React, {Suspense} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CourseTagType, TagType} from "@/lib/db/types";
import {adminGetAllTags} from "@/app/data/admin/admin-get-all-tags";
import {Ban, CheckIcon} from "lucide-react";
import {AdminCategoryCardSkeleton} from "@/app/admin/categories/_components/AdminCategoryCard";
import DeleteBtnItemObjReq from "@/app/admin/courses/[courseId]/edit/_components/DeleteBtnItemObjReq";
import RequisitesObjectivesForm from "@/app/admin/courses/[courseId]/edit/_components/RequistesObjectivesForm";
import CourseTagList from "@/app/admin/courses/[courseId]/edit/_components/CourseTagsLis";

const CourseSettings = ({id, tags, requisites, objectives}:
                              {
                                  id: string,
                                  tags:CourseTagType[],
                                  requisites: { content:string ,  id:string }[],
                                  objectives: { content:string ,  id:string }[]
                              }) => {
    return (
        <>
            <Card className="my-6">
                <CardHeader>
                    <CardTitle>Requisites & Objectives</CardTitle>
                    <CardDescription>
                        Here you can update your Course requisites and objectives.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className=" space-y-3 bg-muted-foreground/10 p-4 rounded-md border flex  flex-col gap-4">
                        <h2>Course Requisites :</h2>
                        <div className="flex-1 space-y-3">
                            {requisites && requisites.length > 0 ?
                                requisites.map((item, index) => (
                                    <p key={index}
                                       className="text-foreground text-base flex  justify-between items-center gap-2 items-center ">
                                   <span className="flex gap-2 items-center">
                                        <CheckIcon className="text-primary size-4"/> {item.content}
                                   </span>
                                        <DeleteBtnItemObjReq key={ index} courseId={id} type={"Requisite"} item={item} />
                                    </p>
                                ))
                                :
                                <p className="text-muted-foreground text-base">
                                    No requisites yet.
                                </p>
                            }
                        </div>
                        {/*TODO Ajouter la possibilite de prendre sans la liste des requiste existants */}
                        <RequisitesObjectivesForm courseId={id} type={"Requisite"}/>
                    </div>
                    <div className=" space-y-3 bg-muted-foreground/10 p-4 rounded-md border flex  flex-col gap-4">
                        <h2>Course Objectives :</h2>
                        <div className="flex-1  space-y-3">
                            {objectives && objectives.length > 0 ?
                                objectives.map((item, index) => (
                                    <p key={index}
                                       className="text-foreground text-base flex  justify-between items-center gap-2 items-center ">
                                   <span className="flex gap-2 items-center">
                                        <CheckIcon className="text-primary size-4"/> {item.content}
                                   </span>
                                        <DeleteBtnItemObjReq key={ index} courseId={id} type={"Objective"} item={item} />
                                    </p>
                                ))
                                :
                                <p className="text-muted-foreground text-base">
                                    No objectives yet.
                                </p>
                            }
                        </div>
                        {/*TODO Ajouter la possibilite de prendre sans la liste des Objectifs  existants */}
                        <RequisitesObjectivesForm courseId={id} type={" Objective"}/>

                    </div>
                </CardContent>
            </Card>
            <Card className="my-6">
                <CardHeader>
                    <CardTitle> Course settings and options</CardTitle>
                    <CardDescription>
                        Here you can update your Course options and settings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className=" space-y-3">
                        <h2>Attached tags :</h2>
                        <Suspense fallback={<AdminTagCardSkeletonLayout/>}>
                            <RenderTags courseId={id} tags={tags.map(tag => ({...tag.tag}))}/>
                        </Suspense>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default CourseSettings;

async function RenderTags({tags, courseId}: { tags: TagType [], courseId: string }) {

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
                <CourseTagList listTags={allTags} courseId={courseId} existingTags={tags}/>
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
