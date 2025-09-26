import {SectionCards} from "@/components/sidebar/section-cards"


import React, {Suspense} from "react";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {adminGetRecentCourses} from "@/app/data/admin/admin-get-recent-courses";
import EmptyState from "@/components/general/EmptyState";
import AdminCourseCard, {AdminCourseCardSkeleton} from "@/app/admin/courses/_components/AdminCourseCard";

export default async function DashboardIndexPage() {

    // const enrollments = await adminGetEnrollmentsStats();

    return (
        <>
            <SectionCards/>

            {/*<ChartAreaInteractive data={enrollments}/>*/}

            {/*<div className="space-y-4">*/}
            {/*    <div className="flex items-center justify-between">*/}
            {/*        <h2 className={"text-xl font-semibold"}>Recent Courses</h2>*/}
            {/*        <Link href={"/admin/courses"}*/}
            {/*              className={buttonVariants({variant: "outline"})}>*/}
            {/*            View All Courses*/}
            {/*        </Link>*/}
            {/*    </div>*/}

            {/*    <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>*/}
            {/*        <RenderRecentCourses/>*/}
            {/*    </Suspense>*/}

            {/*</div>*/}
        </>
    )
}

async function RenderRecentCourses() {
    const data = await adminGetRecentCourses();

    if (data.length === 0) {
        return (
            <EmptyState title={"No Courses Found"}
                        description={"You don't have any courses yet. Create a new course to get started."}
                        buttonText={"Create New Course"}
                        href={"/admin/courses/create"}
            />
        );
    }

    return (
        <div className="grid grid-cols-1  md:grid-cols-2  gap-6 ">
            {data.map((course) => (
                <AdminCourseCard key={course.id} data={course}/>
            ))}
        </div>
    )
}

// function RenderRecentCoursesSkeletonLayout(){
//
//     return (
//         <div className="grid grid-cols-1  md:grid-cols-2  gap-6 ">
//             {Array.from({length: 2}).map((_, index) => (
//                 <AdminCourseCardSkeleton key={index}/>
//             ))}
//         </div>
//     )
//
// }
