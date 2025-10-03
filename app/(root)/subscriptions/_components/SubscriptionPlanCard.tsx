import React from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import { buttonVariants} from "@/components/ui/button";
import {SubscriptionPlanType} from "@/lib/db/types";
import { CURRENCY } from '@/lib/constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {Skeleton} from "@/components/ui/skeleton";

interface AdminPlanCardProps {
    plan: SubscriptionPlanType
}

const SubscriptionPlanCard = ({plan}:AdminPlanCardProps) => {

    return (
        <Card className={`text-center ${plan.selected && "bg-primary/60"}  `}>
            <CardHeader className="border-b line-clamp-1">
                <CardTitle className={"text-2xl font-semibold mb-4"}>{plan.title}</CardTitle>
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
                {plan.stripePriceId ? <Link href={`/subscriptions/subscribe/${plan.id}`}
                                            className={cn(buttonVariants({className: "btn btn-primary"}))}>
                        S&apos;inscrire
                    </Link>
                    :
                    <Link href={`/subscriptions/quotation`}
                          className={cn(buttonVariants({className: "btn btn-primary"}))}>
                        Demander un devis
                    </Link>
                }
            </CardFooter>
        </Card>
    );
};

export default SubscriptionPlanCard;

export function SubscriptionCardPlanSkeleton() {
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
                <div className="my-10 flex flex-col justify-center items-center  rounded-full bg-muted-foreground/10 p-4">
                    <div className="flex items-start justify-center gap-1">
                        <Skeleton className={"h-16 w-8 bg-muted-foreground/10 mx-auto"} />
                        <Skeleton className={"h-16 w-8 bg-muted-foreground/10 mx-auto"} />
                        <Skeleton className={"h-6 w-4 bg-muted-foreground/10 mx-auto"} />
                        <Skeleton className={"h-6 w-6 bg-muted-foreground/10 mx-auto"} />
                    </div>
                    <div className=" text-xs italic ">
                        <Skeleton className={"h-6 w-24 bg-muted-foreground/10 mx-auto"} />
                    </div>
                </div>
                <ul className="list-disc list-inside text-left space-y-4 ml-10">
                    {
                        Array.from({length: 8}).map((_, index) => (
                            <Skeleton key={index} className={"h-6 w-full bg-muted-foreground/10 mx-auto"} />
                        ))
                    }
                </ul>
            </CardContent>
            <CardFooter className="border-t flex justify-center">
                <Skeleton className={"h-10 w-32 bg-muted-foreground/10 mx-auto"} />
            </CardFooter>
        </Card>
    )
}
