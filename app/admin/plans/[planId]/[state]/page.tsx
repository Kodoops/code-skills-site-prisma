"use client";

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button, buttonVariants} from '@/components/ui/button';
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {useParams, useRouter} from "next/navigation";
import {Loader2, Trash2} from "lucide-react";
import { updateStateSubscriptionPlan } from './actions';

const AdminUpdateStateSubscriptionPlan = () => {

    const [pending, startTransition] = useTransition();
    const {planId, state} = useParams<{ planId: string, state:string }>();
    const router = useRouter();

    function onSubmit() {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(updateStateSubscriptionPlan(planId, state));

            if (error) {
                toast.error(error.message, {
                    style: {
                        background: "#FEE2E2",
                        border: "1px solid #EF4444",
                    },
                });
            }
            if (result?.status === "success") {
                toast.success(result?.message, {
                    style: {
                        background: "#D1FAE5",
                        color: "#065F46",
                    },
                });
                router.push("/admin/plans");
            } else {
                toast.error(result?.message, {
                    style: {
                        background: "#FEE2E2",
                        border: "1px solid #EF4444",
                    },
                });
            }
        });
    }

    return (
        <div className={"max-w-xl mx-auto w-full"}>
            <Card className={"mt-32"}>
                <CardHeader>
                    <CardTitle>Are you sure you want {state} this subscription plan ?</CardTitle>
                    <CardDescription >
                        This action  will update state of the subscription plan.
                    </CardDescription>
                </CardHeader>
                <CardContent className={"flex items-center justify-between gap-4"}>
                    <Link href={"/admin/plans"} className={buttonVariants({variant: "outline"})}>
                        Cancel
                    </Link>
                    <Button variant={"destructive"} onClick={onSubmit} disabled={pending}>
                        {pending ? <> <Loader2 className={"size-4 animate-spin"}/> Updating ... </> :
                            <> <Trash2 className={"size-4"}/>Update Plan</>}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminUpdateStateSubscriptionPlan;
