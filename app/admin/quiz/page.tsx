import {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import Pagination from "@/components/general/Pagination";
import { QUIZ_PER_PAGE} from "@/constants/admin-contants";
import AdminQuizCard, {AdminQuizCardSkeleton} from "@/app/admin/quiz/_components/AdminQuizCard";
import {adminGetAllQuiz} from "@/app/data/admin/admin-get-quiz";


const QuizPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);


    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Quiz</h1>
                <Link href={"/admin/quiz/create"}
                      className={buttonVariants()}>
                    Create Quiz
                </Link>
            </div>
            <Suspense fallback={<AdminCourseCardSkeletonLayout/>}>
                <RenderQuiz current={page} nbrPage={QUIZ_PER_PAGE}/>
            </Suspense>
        </>
    );
}

export default QuizPage;

async function RenderQuiz({current, nbrPage}:{current?: number | undefined, nbrPage: number}) {

     const {data, totalPages, perPage, currentPage} = await adminGetAllQuiz(current , nbrPage);
    return (
        <>
            {data?.length === 0 ?
                <EmptyState title={"No Quiz Found"}
                            description={"You don't have any quiz yet. Create a new quiz to get started."}
                            buttonText={"Create Quiz"}
                            href={"/admin/quiz/create"}
                />
                :
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 ">
                        {data?.map((quiz) => (
                            <AdminQuizCard key={quiz.id} data={quiz}/>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7  ">
            {Array.from({length: 4}).map((_, index) => (
                <AdminQuizCardSkeleton key={index}/>
            ))}
        </div>
    )

}
