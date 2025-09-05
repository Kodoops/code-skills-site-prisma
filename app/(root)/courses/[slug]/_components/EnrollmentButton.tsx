"use client"

import { Button } from '@/components/ui/button';
import React, { useTransition } from 'react';
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {enrollInCourseAction} from "@/app/(root)/courses/[slug]/actions";
import {Loader2} from "lucide-react";

export function EnrollmentButton  ({courseId}:{courseId:string}) {

    const [pending, startTransition] = useTransition();

    function onSubmit() {
        startTransition(async () => {
            const {data:result , error} = await tryCatch(enrollInCourseAction(courseId));

            if (error) {
                toast.error(error.message);
            }
            if (result?.status === "success") {
                toast.success(result?.message);
            }else{
                toast.error(result?.message);
            }
        })
    }

    return (
        <Button className={"w-full"} onClick={onSubmit}  disabled={pending} >
            {pending ? <>
            <Loader2 className={"size-4 animate-spin"}/>
                Loading ...
            </> : "Enroll Now !"}
        </Button>
    );
};

