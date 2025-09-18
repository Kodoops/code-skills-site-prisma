import {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import Pagination from "@/components/general/Pagination";
import {LEARNING_PATHS_PER_PAGE} from "@/constants/admin-contants";
import AdminLearningPathCard, {
    AdminLearningPathSkeletonCard
} from "@/app/admin/learning-paths/_components/AdminLearningPathCard";
import {adminGetLearningPaths} from "@/app/data/admin/admin-get-learning-paths";


const LearningPathsPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);


    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Learning Paths</h1>
                <Link href={"/admin/learning-paths/create"}
                      className={buttonVariants()}>
                    Create Learning Path
                </Link>
            </div>
            <Suspense fallback={<AdminCourseCardSkeletonLayout/>}>
                <RenderCourses current={page} nbrPage={LEARNING_PATHS_PER_PAGE}/>
            </Suspense>
        </>
    );
}

export default LearningPathsPage;

async function RenderCourses({current, nbrPage}:{current?: number | undefined, nbrPage: number}) {

     const {data, totalPages, perPage, currentPage} = await adminGetLearningPaths(current , nbrPage);

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
                    <div className="grid grid-cols-1  xl:grid-cols-2 gap-7 ">
                        {data?.map((path) => (
                            <AdminLearningPathCard key={path.id} data={path}/>
                        ))}
                    </div>
                    {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages}/>}
                </>
            }
        </>
    )
}

function AdminCourseCardSkeletonLayout() {
    return (
        <div className="grid grid-cols-1  xl:grid-cols-2 gap-7  ">
            {Array.from({length: 2}).map((_, index) => (
                <AdminLearningPathSkeletonCard key={index}/>
            ))}
        </div>
    )

}
