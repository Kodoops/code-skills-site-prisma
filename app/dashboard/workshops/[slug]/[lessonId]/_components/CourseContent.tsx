"use client";

import React, { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { BookIcon, CheckCircle, Loader2} from "lucide-react";
import { RenderDescription } from '@/components/rich-text-editor/RenderDescription';
import {useConstructUrl} from "@/hooks/use-construct-url";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {markLessonComplete, markLessonUnCompleted} from "@/app/dashboard/courses/[slug]/[lessonId]/actions";
import {useConfetti} from "@/hooks/use-confetti";
import {LessonType} from "@/lib/types";

interface CourseContentProps {
    data : LessonType & { courseId: string; course: { slug: string } }
}

const CourseContent = ({data}: CourseContentProps) => {

    const [pending , startTransition] = useTransition();
    const {triggerConfetti} = useConfetti();

    function VideoPlayer({thumbnailKey, videoKey}: { thumbnailKey: string, videoKey: string  }) {
        const videoUrl = useConstructUrl(videoKey);
        const thumbnailUrl = useConstructUrl(thumbnailKey);

        if(!videoKey ) {
            return (
                <div className={"aspect-video bg-muted rounded-lg flex flex-col items-center justify-center"}>
               <BookIcon className={"size-16 text-primary mx-auto mb-4"}  />
                    <p className={"text-center text-muted-foreground"}  >
                        This lesson has no video yet.
                    </p>
            </div>
            )
        }

        return (
            <div className={"aspect-video bg-black relative rounded-lg"}>
                <video controls  loop
                       poster={thumbnailUrl}
                       className={"w-full h-full object-cover"} >
                    <source src={videoUrl} type="video/mp4" />
                    <source src={videoUrl} type="video/webm" />
                    <source src={videoUrl} type="video/ogg" />

                    your browser does not support the video tag.
                </video>
            </div>
        )
    }

    function onSubmit() {
        startTransition(async () => {
            const {data:result , error} = await tryCatch(markLessonComplete(data.id, data.course.slug));

            if (error) {
                toast.error(error.message);
            }
            if (result?.status === "success") {
                triggerConfetti();
                toast.success(result?.message);
            }else{
                toast.error(result?.message);
            }
        })
    }


    function markUnCompleted() {
        startTransition(async () => {
            const {data:result , error} = await tryCatch(markLessonUnCompleted(data.id, data.course.slug));

            if (error) {
                toast.error(error.message);
            }
            if (result?.status === "success") {
                toast.success(result?.message);
            }else{
                toast.error(result?.message);
            }
        })
    }

    return (
        <div className={"flex flex-col min-h-lvh bg-background pl-6 py-4  md:py-6"}>

           <VideoPlayer videoKey={data.videoKey ?? ''} thumbnailKey={data.thumbnailKey ?? ''} />

            <div className="py-4 border-b">
                {
                    data.lessonProgress.length > 0 && data.lessonProgress[0].completed ? (
                    <Button variant={"outline"}
                            onClick={markUnCompleted}
                            className={"bg-green-500/10 text-green-500 hover:text-green-500 flex items-center  "}>
                        <CheckCircle className={"size-4 mr-2 text-green-500"} />
                        {pending ? <>
                                <Loader2 className={"size-4 animate-spin"}/>
                                <span>Loading ...</span>
                            </> :
                            "Completed"
                        }
                    </Button>
                    ):
                        <Button variant={"outline"}
                                onClick={onSubmit} disabled={pending}
                                className={"flex items-center"}>
                            <CheckCircle className={"size-4 mr-2 text-green-500"}/>
                            {pending ? <>
                                    <Loader2 className={"size-4 animate-spin"}/>
                                    <span>Loading ...</span>
                                </> :
                                "Mark as Completed"
                            }
                        </Button>
                }
            </div>

            <div className="space-y-3 pt-3">
                <h1 className={"text-3xl font-bold tracking-tight text-foreground "}>{data.title}</h1>

                {data.description &&  (
                    <RenderDescription json={(JSON.parse(data.description))} />
                )}
            </div>
        </div>
    );
};

export default CourseContent;
