import {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import {adminGetCourses} from "@/app/data/admin/admin-get-courses";
import AdminCourseCard, {AdminCourseCardSkeleton} from "@/app/admin/courses/_components/AdminCourseCard";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import Pagination from "@/components/general/Pagination";
import {COURSES_PER_PAGE} from "@/constants/admin-contants";


const CoursesPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);


    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Your Cources</h1>
                <Link href={"/admin/courses/create"}
                      className={buttonVariants()}>
                    Create Course
                </Link>
            </div>
            <Suspense fallback={<AdminCourseCardSkeletonLayout/>}>
                <RenderCourses current={page} nbrPage={COURSES_PER_PAGE}/>
            </Suspense>
        </>
    );
}

export default CoursesPage;

async function RenderCourses({current, nbrPage}:{current?: number | undefined, nbrPage: number}) {

     const {data, totalPages, perPage, currentPage} = await adminGetCourses(current , nbrPage);
    return (
        <>
            {data?.length === 0 ?
                <EmptyState title={"No Courses Found"}
                            description={"You don't have any courses yet. Create a new course to get started."}
                            buttonText={"Create Course"}
                            href={"/admin/courses/create"}
                />
                :
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7 ">
                        {data?.map((course) => (
                            <AdminCourseCard key={course.id} data={course}/>
                        ))}
                    </div>
                    <Pagination page={currentPage} totalPages={totalPages}/>
                </>
            }
        </>
    )
}

function AdminCourseCardSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7 ">
            {Array.from({length: 4}).map((_, index) => (
                <AdminCourseCardSkeleton key={index}/>
            ))}
        </div>
    )

}
