"use client";

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button, buttonVariants} from '@/components/ui/button';
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {useParams, useRouter} from "next/navigation";
import {Loader2, Trash2} from "lucide-react";
import { restoreDeletedWorkshopSoftly } from './actions';

const AdminRestoreDeleteWorkshop = () => {

    const [pending, startTransition] = useTransition();
    const {workshopId} = useParams<{ workshopId: string }>();
    const router = useRouter();


    function onSubmit() {
        startTransition(async () => {
           const { data: result, error } = await tryCatch(restoreDeletedWorkshopSoftly(workshopId));

            if (error) {
                toast.error(error.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
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
                router.push("/admin/workshops");
            } else {
                toast.error(result?.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
        });
    }

    return (
        <div className={"max-w-xl mx-auto w-full"}>
            <Card className={"mt-32"}>
                <CardHeader>
                    <CardTitle>Are you sure you want to restore this workshop ?</CardTitle>
                    <CardDescription>
                        This action will restore deleted softly workshop data.
                    </CardDescription>
                </CardHeader>
                <CardContent className={"flex items-center justify-between gap-4"}>
                    <Link href={"/admin/workshops"} className={buttonVariants({variant: "outline"})}>
                        Cancel
                    </Link>
                    <Button variant={"destructive"} onClick={onSubmit} disabled={pending}>
                        {pending ? <> <Loader2 className={"size-4 animate-spin"}/> Restoring ... </> :
                            <> <Trash2 className={"size-4"}/>Restore Deleted Workshop</>}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminRestoreDeleteWorkshop;
