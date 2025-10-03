import React from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {SubscriptionPlanType} from "@/lib/db/types";
import {CURRENCY} from '@/lib/constants';
import Link from 'next/link';
import {Skeleton} from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MoreVerticalIcon, PencilIcon, ToggleLeftIcon, ToggleRightIcon, Trash2Icon} from "lucide-react";
import ManageOptions from "@/app/admin/plans/_components/ManageOptions";

interface AdminPlanCardProps {
    plan: SubscriptionPlanType
}

const AdminPlanCard = ({plan}: AdminPlanCardProps) => {

    return (
        <Card className={`relative text-center ${plan.active && plan.selected && "bg-primary/60"}  ${!plan.active  && "bg-destructive/20"} `}>
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
                            <Link href={`/admin/plans/${plan.id}/edit`}>
                                <PencilIcon className={"size-4 mr-2"}/>
                                Edit Plan
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            { !plan.active ? <Link href={`/admin/plans/${plan.id}/active`}>
                                <ToggleRightIcon className={"size-4 mr-2 text-primary"}/>
                                Active Plan
                            </Link>
                                :
                                <Link href={`/admin/plans/${plan.id}/inactive`}>
                            <ToggleLeftIcon className={"size-4 mr-2 text-destructive"}/>
                            InActive Plan
                        </Link>}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/plans/${plan.id}/delete`}>
                                <Trash2Icon className={"size-4 mr-2 text-destructive"}/>
                                Delete Plan
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <CardHeader className="border-b">
                <CardTitle className={"text-xl font-semibold mb-4 line-clamp-1" }>{plan.title}</CardTitle>
                <CardDescription className={"line-clamp-2"}>
                    {plan.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="my-6  flex-1">
                <div className="my-10 flex flex-col justify-center items-center  rounded-full bg-primary/60 p-4">

                    {plan.price > 0 ?
                        <>
                        <div className="flex items-start justify-center"><span
                            className={"text-6xl font-bold"}>{plan.price / 100}</span>
                            <span
                                className={"text-2xl font-bold"}>{CURRENCY[plan.currency as keyof typeof CURRENCY]}</span>
                            <span className={"text-2xl"}>{(plan.price % 100).toString().padStart(2, "0")}</span>
                        </div>
                        <div className=" text-xs italic ">
                            {plan.interval === "monthly" ? "par mois" : "par an"}
                        </div>
                        </>
                        :
                        <div className="flex flex-col items-start justify-center">
                            <div className="flex items-start justify-center">
                                <span className={"text-2xl font-bold"}>Prix a définir</span>
                            </div>
                            <div className=" text-xs italic ">
                                par an / mois selon devis
                            </div>
                        </div>}

                </div>
                <ul className="list-disc list-inside text-left space-y-4 ml-10">
                    {
                        plan.options.map((option, index) => (
                            <li key={index}>{option}</li>
                        ))
                    }
                </ul>
            </CardContent>
            <CardFooter className="border-t flex justify-center">
                <ManageOptions id={plan.id} options={plan.options}/>
            </CardFooter>
        </Card>
    );
};

export default AdminPlanCard;

export function AdminCardPlanSkeleton() {
    return (
        <Card className="text-center">
            <CardHeader className="border-b">
                <CardTitle className={"text-2xl font-semibold mb-4"}>
                    <Skeleton className={"h-6 w-1/3 bg-muted-foreground/10 mx-auto"}/>
                </CardTitle>
                <CardDescription className={"space-y-1"}>
                    <Skeleton className={"h-6 w-full bg-muted-foreground/10 mx-auto"}/>
                    <Skeleton className={"h-6 w-3/4 bg-muted-foreground/10 mx-auto"}/>
                </CardDescription>
            </CardHeader>
            <CardContent className="my-6  flex-1 space-y-1">
                <div
                    className="my-10 flex flex-col justify-center items-center  rounded-full bg-muted-foreground/10 p-4">
                    <div className="flex items-start justify-center gap-1">
                        <Skeleton className={"h-16 w-8 bg-muted-foreground/10 mx-auto"}/>
                        <Skeleton className={"h-16 w-8 bg-muted-foreground/10 mx-auto"}/>
                        <Skeleton className={"h-6 w-4 bg-muted-foreground/10 mx-auto"}/>
                        <Skeleton className={"h-6 w-6 bg-muted-foreground/10 mx-auto"}/>
                    </div>
                    <div className=" text-xs italic ">
                        <Skeleton className={"h-6 w-24 bg-muted-foreground/10 mx-auto"}/>
                    </div>
                </div>
                <ul className="list-disc list-inside text-left space-y-4 ml-10">
                    {
                        Array.from({length: 8}).map((_, index) => (
                            <Skeleton key={index} className={"h-6 w-full bg-muted-foreground/10 mx-auto"}/>
                        ))
                    }
                </ul>
            </CardContent>
            <CardFooter className="border-t flex justify-center">
                <Skeleton className={"h-10 w-32 bg-muted-foreground/10 mx-auto"}/>
            </CardFooter>
        </Card>
    )
}
