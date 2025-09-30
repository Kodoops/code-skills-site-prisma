import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import Link from "next/link";
import {
    ArrowRight,
    EyeIcon,
    MoreVerticalIcon,
    PencilIcon,
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
import {QuizType} from "@/lib/db/types";

interface AdminQuizCardProps {
    data: QuizType;
}
const AdminQuizCard = ({data}:AdminQuizCardProps) => {


    return (
        <Card className="group relative py-1 gap-0">
            {/*    absolute dropdown */}
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                     <Button  variant={"secondary"} size={"icon"} >
                        <MoreVerticalIcon className={"size-4"}/>
                     </Button>
                 </DropdownMenuTrigger>
                    <DropdownMenuContent align={"end"} className={"w-48"}>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/quiz/${data.id}/edit`}>
                                <PencilIcon className={"size-4 mr-2"} />
                                Edit Quiz
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/quiz/${data.slug}`}>
                                <EyeIcon className={"size-4 mr-2"} />
                                Review Quiz
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/quiz/${data.id}/delete`}>
                                <Trash2Icon className={"size-4 mr-2 text-destructive"} />
                                Delete Quiz
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <CardContent className="p-4">
                <Link href={`/admin/courses/${data.id}`}
                className={"group-hover:text-primary transition-colors font-medium text-lg line-clamp-2 hover:underline"}>
                    {data.title}
                </Link>
                <p className="line-clamp-2 text-xm text-muted-foreground leading-tight mt-2">
                    {data.description}
                </p>

                { (data.courseId || data.chapterId ) && <div className=" border border-border p-2 rounded-full text-xs text-center bg-muted-foreground/10  my-3">
                        Quiz Linked to : {data.courseId ? "Course" : "Chapter"}
                </div>}

                <Link href={`/admin/quiz/${data.id}/edit`} className={buttonVariants({className: "mt-4 w-full"})}>
                    Edit Quiz <ArrowRight className={"size-4"}/>
                </Link>
            </CardContent>
        </Card>
    );
};

export default AdminQuizCard;

export function AdminQuizCardSkeleton() {
    return <Card className="group relative py-1 gap-0">
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2" >
           <Skeleton  className={"h-6 w-16 rounded-full  bg-foreground/10"}/>
       </div>

       <CardContent className="p-4">
           <Skeleton  className={"h-6 w-3/4 mt-2 rounded  bg-foreground/10"}/>
           <Skeleton  className={"w-full h-4 mt-4 rounded  bg-foreground/10"}/>

           <Skeleton  className={buttonVariants({variant:'outline',className: "mt-4 h-10 w-full rounded"})}/>
       </CardContent>
   </Card>
}
