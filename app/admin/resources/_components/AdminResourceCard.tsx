import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {useConstructUrl} from "@/hooks/use-construct-url";
import Link from "next/link";
import {
    EyeIcon,
    MoreVerticalIcon,
    Trash2Icon
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Skeleton} from "@/components/ui/skeleton";
import {ResourceType} from "@/lib/types";

interface AdminResourceCardProps {
    data: ResourceType;
}

const AdminResourceCard = ({data}: AdminResourceCardProps) => {

    const thumbnailUrl = useConstructUrl(data.fileKey??'');

    return (
        <Card className={`group relative py-1 gap-0 `}>
            {/*    absolute dropdown */}
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"secondary"} size={"icon"}>
                            <MoreVerticalIcon className={"size-4"}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={"end"} className={"w-48"}>
                        <DropdownMenuItem asChild>
                            <Link href={`/resources/${data.id}/download`}>
                                <EyeIcon className={"size-4 mr-2"}/>
                                Download Resource
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/resources/${data.id}/delete`}>
                                <Trash2Icon className={"size-4 mr-2 text-destructive"}/>
                                Delete Resource
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Image src={thumbnailUrl} alt="thumbnail image" width={600} height={400}
                   className="aspect-video rounded-lg w-full h-full object-cover"/>

            <CardContent className="p-4">
                <Link href={`/admin/resources/${data.id}`}
                      className={"group-hover:text-primary transition-colors font-medium text-lg line-clamp-2 hover:underline"}>
                    {data.title}
                </Link>
                <p className="line-clamp-2 text-xm text-muted-foreground leading-tight mt-2">
                    {data.description}
                </p>

            </CardContent>
        </Card>
    );
};

export default AdminResourceCard;

export function AdminResourceCardSkeleton() {
    return <Card className="group relative py-1 gap-0">
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
            <Skeleton className={"size-8 rounded-md bg-foreground/10"}/>
        </div>
        <div className={" w-full relative h-fit"}>
            <Skeleton className={"w-full h- rounded-t-lg aspect-video h-[140px] object-cover bg-foreground/10"}/>
        </div>

        <CardContent className="p-4">
            <Skeleton className={"h-6 w-3/4 mt-2 rounded bg-foreground/10"}/>
            <Skeleton className={"w-full h-4 mt-4 rounded bg-foreground/10"}/>

        </CardContent>
    </Card>
}
