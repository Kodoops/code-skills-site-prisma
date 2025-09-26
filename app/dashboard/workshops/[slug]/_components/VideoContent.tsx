import React from 'react';
import {useConstructUrl} from "@/hooks/use-construct-url";
import {BookIcon, CircleOff} from "lucide-react";

export const VideoContent = ({thumbnailKey, videoKey}: { thumbnailKey: string, videoKey: string }) => {
    const videoUrl = useConstructUrl(videoKey);
    const thumbnailUrl = useConstructUrl(thumbnailKey);

    if (!videoKey) {
        return (
            <div className={"aspect-video bg-muted rounded-lg flex flex-col items-center justify-center"}>
                <CircleOff className={"size-16 text-primary mx-auto mb-4"}/>
                <p className={"text-center text-muted-foreground"}>
                    This workshop has no video yet.
                </p>
            </div>
        )
    }

    return (
        <div className={"aspect-video bg-black relative rounded-lg"}>
            <video controls loop
                   poster={thumbnailUrl}
                   className={"w-full h-full object-cover"}>
                <source src={videoUrl} type="video/mp4"/>
                <source src={videoUrl} type="video/webm"/>
                <source src={videoUrl} type="video/ogg"/>

                your browser does not support the video tag.
            </video>
        </div>
    )
}

