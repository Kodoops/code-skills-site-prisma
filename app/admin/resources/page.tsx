import {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import Pagination from "@/components/general/Pagination";
import {RESOURCES_PER_PAGE} from "@/constants/admin-contants";
import AdminResourceCard, { AdminResourceCardSkeleton } from "./_components/AdminResourceCard";
import {adminGetResources} from "@/app/data/admin/admin-get-resources";


const ResourcesPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);


    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Resources</h1>
                <Link href={"/admin/resources/create"}
                      className={buttonVariants()}>
                    Create Resource
                </Link>
            </div>
            <Suspense fallback={<AdminResourceCardSkeletonLayout/>}>
                <RenderResources current={page} nbrPage={RESOURCES_PER_PAGE}/>
            </Suspense>
        </>
    );
}

export default ResourcesPage;

async function RenderResources({current, nbrPage}:{current?: number | undefined, nbrPage: number}) {

     const {data, totalPages, perPage, currentPage} = await adminGetResources(current , nbrPage);

    return (
        <>
            {data?.length === 0 ?
                <EmptyState title={"No Resource Found"}
                            description={"You don't have any resource yet. Create a new resource to get started."}
                            buttonText={"Create Resource"}
                            href={"/admin/resources/create"}
                />
                :
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-7 ">
                        {data?.map((resource) => (
                            <AdminResourceCard key={resource.id} data={resource}/>
                        ))}
                    </div>
                    {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages}/>}
                </>
            }
        </>
    )
}

function AdminResourceCardSkeletonLayout() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-7 ">
            {Array.from({length: 4}).map((_, index) => (
                <AdminResourceCardSkeleton key={index}/>
            ))}
        </div>
    )

}
