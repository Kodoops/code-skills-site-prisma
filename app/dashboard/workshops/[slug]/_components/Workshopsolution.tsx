import React from 'react';
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";
import {VideoContent} from "@/app/dashboard/workshops/[slug]/_components/VideoContent";
import {WorkshopType} from "@/lib/db/types";
import Link from 'next/link';
import {CircleOff, FileIcon, LinkIcon} from "lucide-react";

const WorkshopSolution = ({workshop}: { workshop: WorkshopType }) => {

    return (
        <>
            <div className={"flex flex-col min-h-lvh bg-background pl-6 py-4  md:py-6 space-y-6"}>
                <h1 className={"text-3xl font-bold tracking-tight text-foreground mb-4"}> Workshop
                    : {workshop.title}</h1>

                    <>
                        <p className={"text-muted-foreground text-lg border-b pb-2 mb-4"}>
                            Video Solution of the Workshop
                        </p>
                        <VideoContent videoKey={workshop.solutionVideoKey ?? ''}
                                      thumbnailKey={workshop.fileKey ?? ''}/>
                    </>

                <div className="space-y-3 py-3">

                    {workshop.solution ? <>
                        <p className={"text-muted-foreground text-lg border-b pb-2 mb-4"}>
                            Solution :
                        </p>
                        <RenderDescription json={(JSON.parse(workshop.solution))}/>
                    </>
                        :
                        <>
                            <CircleOff className={"size-16 text-primary mx-auto mb-4"}/>
                            <p className={"text-muted-foreground text-lg text-center pb-2 mb-4"}>
                                No Solution Description Available yet.
                            </p>
                        </>
                    }
                </div>

                <div className="space-y-3 py-3">
                    {workshop.solutionFileKey && <>
                        <p className={"text-muted-foreground text-lg border-b pb-2 mb-4"}>
                            solution files  :
                        </p>
                        <Link href={workshop.solutionFileKey}
                              className={"text-primary flex items-center gap-6"}>
                            <FileIcon className={"size-6"}/> Get Files
                        </Link>

                    </>
                    }
                    {workshop.solutionFileUrl &&
                        <div className={"flex items-center gap-6"}>
                      <span>
                                Solution Files URL :
                        </span>
                            <Link href={workshop.solutionFileUrl}  className={"text-primary flex items-center gap-6"}>
                                <LinkIcon className={"size-6"}/> {workshop.solutionFileUrl}
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default WorkshopSolution;


