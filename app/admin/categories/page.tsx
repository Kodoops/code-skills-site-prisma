import React, {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import AdminCategoryCard, {AdminCategoryCardSkeleton} from "@/app/admin/categories/_components/AdminCategoryCard";
import {getPaginatedCategories} from "@/app/data/categories/get-all-categories";
import Pagination from "@/components/general/Pagination";
import {CATEGORIES_PER_PAGE} from "@/constants/admin-contants";


const CategoriesPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Our Categories</h1>
                <Link href={"/admin/categories/create"}
                      className={buttonVariants()}>
                    Create Category
                </Link>
            </div>
            <Suspense fallback={<AdminCategoryCardSkeletonLayout/>}>
                <RenderCategories current={page} nbrPage={CATEGORIES_PER_PAGE}/>
            </Suspense>
        </>
    );
}

export default CategoriesPage;

async function RenderCategories({current, nbrPage}: { current?: number | undefined, nbrPage: number }) {

    const {data, page, perPage, total, totalPages} = await getPaginatedCategories(current, nbrPage);

    return (
        <>
            {data.length === 0 ?
                <EmptyState title={"No Categories Found"}
                            description={"You don't have any category yet. Create a new category to get started."}
                            buttonText={"Create Category"}
                            href={"/admin/categories/create"}
                />
                :
                <>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
                        {data.map((category) => {

                                return <AdminCategoryCard key={category.id} {...category} />
                            }
                        )}
                    </div>

                    {totalPages > 1 && <Pagination page={page} totalPages={totalPages}/>}
                </>
            }
        </>
    )
}

function AdminCategoryCardSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
            {Array.from({length: 4}).map((_, index) => (
                <AdminCategoryCardSkeleton key={index}/>
            ))}
        </div>
    )

}
