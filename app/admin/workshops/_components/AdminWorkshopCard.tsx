import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {useConstructUrl} from "@/hooks/use-construct-url";
import Link from "next/link";
import {
    ArrowRight,
    EyeIcon,
    MoreVerticalIcon,
    PencilIcon,
    SchoolIcon,
    TimerIcon,
    Trash2Icon
} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Skeleton} from "@/components/ui/skeleton";
import ProductPrice from "@/components/custom-ui/ProductPrice";
import {calculatedPrice} from "@/lib/price";
import {WorkshopType} from "@/lib/db/types";
import {Badge} from "@/components/ui/badge";

interface AdminCourseCardProps {
    data: WorkshopType;
}
const AdminWorkshopCard = ({data}:AdminCourseCardProps) => {

    const thumbnailUrl  = useConstructUrl(data.fileKey);
    const finalPrice = calculatedPrice(data.price!, data?.promotions?.[0])

    const isDeleted = data.deletedAt !== null && data.deletedAt !== undefined;

    return (
        <Card className={`group relative py-1 gap-0 ` + (isDeleted ?"bg-red-500/20" :"")}>
            {/*    absolute dropdown */}
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                     <Button  variant={"secondary"} size={"icon"} >
                        <MoreVerticalIcon className={"size-4"}/>
                     </Button>
                 </DropdownMenuTrigger>
                    {isDeleted?
                        <DropdownMenuContent align={"end"} className={"w-48"}>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/workshops/${data.id}/restore`}>
                                    <PencilIcon className={"size-4 mr-2"}/>
                                    Restore Workshop
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator/>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/workshops/${data.id}/delete?state=permanently`}>
                                    <Trash2Icon className={"size-4 mr-2 text-destructive"}/>
                                    Delete Workshop Permanently
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        : <DropdownMenuContent align={"end"} className={"w-48"}>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/workshops/${data.id}/edit`}>
                                <PencilIcon className={"size-4 mr-2"}/>
                                Edit Workshop
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/workshops/${data.slug}`}>
                                <EyeIcon className={"size-4 mr-2"}/>
                                Review Workshop
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/workshops/${data.id}/delete?state=soft`}>
                                <Trash2Icon className={"size-4 mr-2 text-destructive"}/>
                                Delete Workshop
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>}
                </DropdownMenu>
            </div>
            <Badge className={"absolute top-2 left-2"}
                   variant = {data.status=== 'Published' ?"default" : data.status=== 'Draft' ? "secondary" :  "destructive" }
            >
                {data.status}
            </Badge>
            <Image src={thumbnailUrl} alt="thumbnail image" width={600} height={400}
            className="aspect-video rounded-lg w-full h-full object-cover"/>

            <CardContent className="p-4">
                <Link href={`/admin/workshops/${data.id}`}
                className={"group-hover:text-primary transition-colors font-medium text-lg line-clamp-2 hover:underline"}>
                    {data.title}
                </Link>
                <p className="line-clamp-2 text-xm text-muted-foreground leading-tight mt-2">
                    {data.description}
                </p>

                <div className="mt-4 flex items-center justify-between gap-x-5">
                    <div className="flex items-center gap-x-5">
                        <div className="flex items-center gap-x-2">
                            <TimerIcon className={"size-6 p-1 rounded-md bg-primary bg-primary/10"}/>
                            <p className={"text-sm  text-muted-foreground"}>
                                {data.duration}h
                            </p>
                        </div>

                        <div className="flex items-center gap-x-2">
                            <SchoolIcon className={"size-6 p-1 rounded-md bg-primary bg-primary/10"}/>
                            <p className={"text-sm  text-muted-foreground"}>
                                {data.level}
                            </p>
                        </div>
                    </div>
                    <ProductPrice finalPrice={finalPrice} price={data.price!}/>
                </div>

                {isDeleted ?
                    <span className={buttonVariants({variant:"destructive", className: "mt-4 w-full"})}>
                        Workshop deleted.
                    </span>
                    :
                    <Link href={`/admin/workshops/${data.id}/edit`} className={buttonVariants({className: "mt-4 w-full"})}>
                    Edit Workshop <ArrowRight className={"size-4"}/>
                </Link>
                }
            </CardContent>
        </Card>
    );
};

export default AdminWorkshopCard;

export function AdminWorkshopCardSkeleton() {
    return <Card className="group relative py-1 gap-0">
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2" >
           <Skeleton  className={"h-6 w-16 rounded-full"}/>
           <Skeleton  className={"size-8 rounded-md"}/>
       </div>
       <div className={" w-full relative h-fit"}>
           <Skeleton  className={"w-full h- rounded-t-lg aspect-video h-[250px] object-cover"}/>
       </div>

       <CardContent className="p-4">
           <Skeleton  className={"h-6 w-3/4 mt-2 rounded"}/>
           <Skeleton  className={"w-full h-4 mt-4 rounded"}/>
           <div className={"mt-4 flex items-center gap-x-5"}>
               <div className={"flex items-center gap-x-2"}>
                   <Skeleton className={"size-6  rounded-md"}/>
                   <Skeleton className={"h-4 w-10 rounded"}/>
               </div>

               <div className={"flex items-center gap-x-2"}>
                   <Skeleton className={"size-6  rounded-md"}/>
                   <Skeleton className={"h-4 w-10 rounded"}/>
               </div>
           </div>

           <Skeleton  className={buttonVariants({variant:'outline',className: "mt-4 h-10 w-full rounded"})}/>
       </CardContent>
   </Card>
}
