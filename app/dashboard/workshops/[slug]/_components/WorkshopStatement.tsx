import React from 'react';
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";
import {VideoContent} from "@/app/dashboard/workshops/[slug]/_components/VideoContent";
import {WorkshopType} from "@/lib/db/types";
import Link from 'next/link';
import {FileIcon, LinkIcon} from "lucide-react";

const WorkshopStatement = ({workshop}: { workshop: WorkshopType }) => {

    return (
        <>
            <div className={"flex flex-col min-h-lvh bg-background pl-6 py-4  md:py-6 space-y-6"}>
                <h1 className={"text-3xl font-bold tracking-tight text-foreground mb-4"}> Workshop
                    : {workshop.title}</h1>

                {workshop.statementVideoKey &&
                    <>
                        <p className={"text-muted-foreground text-lg border-b pb-2 mb-4"}>
                            Video Statement of the Workshop
                        </p>
                        <VideoContent videoKey={workshop.statementVideoKey ?? ''}
                                      thumbnailKey={workshop.fileKey ?? ''}/>
                    </>
                }

                <div className="space-y-3 py-3">

                    {workshop.statement && <>
                        <p className={"text-muted-foreground text-lg border-b pb-2 mb-4"}>
                            Statement:
                        </p>
                        <RenderDescription json={(JSON.parse(workshop.statement))}/>
                    </>
                    }
                </div>

                <div className="space-y-3 py-3">
                    {workshop.statementsStartFileKey && <>
                        <p className={"text-muted-foreground text-lg border-b pb-2 mb-4"}>
                            Starter Kit :
                        </p>
                        <Link href={workshop.statementsStartFileKey}
                              className={"text-primary flex items-center gap-6"}>
                            <FileIcon className={"size-6"}/> Starter kit files
                        </Link>

                    </>
                    }
                    {workshop.statementsStartFileUrl &&
                        <div className={"flex items-center gap-6"}>
                      <span>
                                Statement Starter Files URL :
                        </span>
                            <Link href={workshop.statementsStartFileUrl}  className={"text-primary flex items-center gap-6"}>
                                <LinkIcon className={"size-6"}/> {workshop.statementsStartFileUrl}
                            </Link>
                        </div>

                    }
                </div>
            </div>
        </>
    )
}

export default WorkshopStatement;


