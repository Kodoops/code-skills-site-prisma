import EmptyState from "@/components/general/EmptyState";
import Pagination from "@/components/general/Pagination";
import {Suspense} from "react";
import {PublicCourseCardSkeleton} from "@/app/(root)/_components/PublicCourseCard";
import {WORKSHOPS_PER_PAGE} from "@/constants/admin-contants";
import WorkshopProgressCard from "@/app/dashboard/workshops/_components/WorkshopProgressCard";
import {getEnrolledWorkshops} from "@/app/data/user/get-enrolled-workshops";
import {WorkshopType} from "@/lib/types";


export default async function EnrolledWorkshopsUserPage(props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);

    return (
        <>
            <div className="flex flex-col gap-2 mt-4">
                <h1 className={"text-3xl font-bold"}>Enrolled Workshops</h1>
                <p className={"text-muted-foreground"}>
                    Here you can see all the workshops you have enrolled in.
                </p>
            </div>

            <Suspense fallback={<UserCourseCardSkeletonLayout/>}>
                <RenderWorkshops current={page} nbrPage={WORKSHOPS_PER_PAGE}/>
            </Suspense>

        </>
    )
}

async function RenderWorkshops({current, nbrPage}:{current?: number | undefined, nbrPage: number}) {
    const {data:enrolledWorkshops, totalPages, perPage, currentPage} = await getEnrolledWorkshops(current, nbrPage);

    return (
        <>
            {
                enrolledWorkshops.length === 0 ? (
                    <EmptyState
                        title={"No Workshop Found"}
                        description={"You don't have any workshops yet. Enroll in a workshop to get started."}
                        buttonText={"Enroll in a Workshop"}
                        href={"/workshops"}
                    />
                ) : (
                    <>

                        <div className={"grid grid-cols-1 md:grid-cols-3 gap-6"}>
                            {enrolledWorkshops.map((item) => {
                                if(!item) return null;
                                return <WorkshopProgressCard key={item?.workshop?.id} data={item.workshop as unknown as WorkshopType }/>
                            })}
                        </div>

                        <Pagination page={currentPage} totalPages={totalPages}/>
                    </>
                )
            }
        </>

    )
}

function UserCourseCardSkeletonLayout() {
    return (
        <div className={"grid grid-cols-1 md:grid-cols-3 gap-6"}>
            {Array.from({length: 6}).map((_, index) => (
                <PublicCourseCardSkeleton key={index}/>
            ))}
        </div>
    )

}
