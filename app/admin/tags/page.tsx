import React, {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import  {AdminCategoryCardSkeleton} from "@/app/admin/categories/_components/AdminCategoryCard";
import AdminTagCard from "./_components/AdminTagCard";
import {adminGetTags} from "@/app/data/admin/admin-get-all-tags";
import Pagination from "@/components/general/Pagination";
import {TAGS_PER_PAGE} from "@/constants/admin-contants";


const TagsPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Our Tags</h1>
                <Link href={"/admin/tags/create"}
                      className={buttonVariants()}>
                    Create Tag
                </Link>
            </div>
            <Suspense fallback={<AdminTagCardSkeletonLayout />}>
                <RenderTags current={page} nbrPage={TAGS_PER_PAGE}/>
            </Suspense>
        </>
    );
}

export default TagsPage;

async function RenderTags({current, nbrPage}: { current?: number | undefined, nbrPage: number }) {

    const {data, page, perPage, total, totalPages} = await adminGetTags(current, nbrPage);

    const toTagsCardProps = (row: {
        title: string;
        color: string | null;
        id: string;
    }) => ({
        id: row.id,
        title: row.title,
        color: row.color ?? "muted",
    });

    return (
        <>
            {data.length === 0 ?
                <EmptyState title={"No Tags Found"}
                            description={"You don't have any tag yet. Create a new tag to get started."}
                            buttonText={"Create Tag"}
                            href={"/admin/tags/create"}
                />
                :
                <>
                    <div className="flex items-center justify-center gap-4">
                        {data.map((tag) => {
                                const props = toTagsCardProps(tag);

                                return <AdminTagCard key={tag.id} {...props} />
                            }
                        )}
                    </div>
                    <Pagination page={page} totalPages={totalPages}/>
                </>
            }
        </>
    )
}

function AdminTagCardSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
            {Array.from({length: 4}).map((_, index) => (
                <AdminCategoryCardSkeleton key={index}/>
            ))}
        </div>
    )

}
