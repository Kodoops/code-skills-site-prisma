import {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import Pagination from "@/components/general/Pagination";
import { WORKSHOPS_PER_PAGE } from "@/constants/admin-contants";
import {adminGetWorkshops} from "@/app/data/admin/admin-get-workshops";
import AdminWorkshopCard, { AdminWorkshopCardSkeleton } from "@/app/admin/workshops/_components/AdminWorkshopCard";


const WorkshopsPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);


    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Workshops</h1>
                <Link href={"/admin/workshops/create"}
                      className={buttonVariants()}>
                    Create Workshop
                </Link>
            </div>
            <Suspense fallback={<AdminWorkshopCardSkeletonLayout/>}>
                <RenderWorkshops current={page} nbrPage={WORKSHOPS_PER_PAGE}/>
            </Suspense>
        </>
    );
}

export default WorkshopsPage;

async function RenderWorkshops({current, nbrPage}:{current?: number | undefined, nbrPage: number}) {

     const {data, totalPages, perPage, currentPage} = await adminGetWorkshops(current , nbrPage);

    return (
        <>
            {data?.length === 0 ?
                <EmptyState title={"No Workshop Found"}
                            description={"You don't have any workshop yet. Create a new workshop to get started."}
                            buttonText={"Create Workshop"}
                            href={"/admin/workshops/create"}
                />
                :
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7 ">
                        {data?.map((workshop) => (
                            <AdminWorkshopCard key={workshop.id} data={workshop}/>
                        ))}
                    </div>
                    {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages}/>}
                </>
            }
        </>
    )
}

function AdminWorkshopCardSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7 ">
            {Array.from({length: 4}).map((_, index) => (
                <AdminWorkshopCardSkeleton key={index}/>
            ))}
        </div>
    )

}
