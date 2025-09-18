"use client";

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button, buttonVariants} from '@/components/ui/button';
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {useParams, useRouter} from "next/navigation";
import {Loader2, Trash2} from "lucide-react";
import { deleteCategory } from './actions';

const AdminDeleteCategory = () => {

    const [pending, startTransition] = useTransition();
    const {categoryId} = useParams<{ categoryId: string }>();
    const router = useRouter();

    function onSubmit() {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(deleteCategory(categoryId));

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
                router.push("/admin/categories");
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
                    <CardTitle>Are you sure you want to delete this category ?</CardTitle>
                    <CardDescription >
                        This action is irreversible. this will delete all the category data.
                    </CardDescription>
                </CardHeader>
                <CardContent className={"flex items-center justify-between gap-4"}>
                    <Link href={"/admin/categories"} className={buttonVariants({variant: "outline"})}>
                        Cancel
                    </Link>
                    <Button variant={"destructive"} onClick={onSubmit} disabled={pending}>
                        {pending ? <> <Loader2 className={"size-4 animate-spin"}/> Deleting ... </> :
                            <> <Trash2 className={"size-4"}/>Delete Category</>}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDeleteCategory;
