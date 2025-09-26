import React from 'react';
import Image from 'next/image';
import {useConstructUrl} from "@/hooks/use-construct-url";

export function MiniCard({title,  fileKey}: { title?: string,  fileKey?: string }) {

    const previewUrl = useConstructUrl(fileKey ?? '');

    return (
        <div className="border rounded-lg  shadow-sm hover:shadow-md transition relative">
            <Image src={previewUrl} alt={title?? 'url'} className="w-auto h-auto aspect-video rounded-lg"
                   width={360} height={160}/>
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2 rounded-b-lg">
                <h4 className=" text-sm">{title}</h4>
            </div>
        </div>
    );
}
