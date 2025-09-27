import {Suspense} from "react";
import EmptyState from "@/components/general/EmptyState";
import Pagination from "@/components/general/Pagination";
import {LEARNING_PATHS_PER_PAGE} from "@/constants/admin-contants";
import {
    AdminLearningPathSkeletonCard
} from "@/app/admin/learning-paths/_components/AdminLearningPathCard";
import {getEnrolledLearningPaths} from "@/app/data/user/get-enrolled-learning-paths";
import LearningPathCard from "@/app/(root)/_components/LearningPathCard";
import {LearningPathType} from "@/lib/db/types";


const LearningPathsPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);


    return (
        <>
            <div className="flex flex-col gap-2 mt-4">
                <h1 className={"text-3xl font-bold"}>Enrolled Learning Paths</h1>
                <p className={"text-muted-foreground"}>
                    Here you can see all the learning paths you have enrolled in.
                </p>
            </div>

            <Suspense fallback={<AdminLearningPathCardSkeletonLayout/>}>
            <RenderLearningPaths current={page} nbrPage={LEARNING_PATHS_PER_PAGE}/>
            </Suspense>

        </>
    );
}

export default LearningPathsPage;

async function RenderLearningPaths({current, nbrPage}:{current?: number | undefined, nbrPage: number}) {

    const {data: enrolledPaths, totalPages, perPage, currentPage} = await getEnrolledLearningPaths(current, nbrPage);


    return (
        <>
            {enrolledPaths?.length === 0 ?
                <EmptyState title={"No Learning Path Found"}
                            description={"You don't have any Learning Path yet. Create a new learning path to get started."}
                            buttonText={"Create  Learning Path"}
                            href={"/admin/learning-paths/create"}
                />
                :
                <>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                        {enrolledPaths?.map((path) => (
                            <LearningPathCard key={path?.id} data={path! as unknown as LearningPathType } isEnrolled={true}/>
                        ))}
                    </div>
                    {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages}/>}
                </>
            }
        </>
    )
}

function AdminLearningPathCardSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 ">
            {Array.from({length: 2}).map((_, index) => (
                <AdminLearningPathSkeletonCard key={index}/>
            ))}
        </div>
    )

}
