import {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import { adminGetCategories} from "@/app/data/admin/admin-get-categories";
import AdminCategoryCard, {AdminCategoryCardSkeleton} from "@/app/admin/categories/_components/AdminCategoryCard";

const CategoriesPage = () => {

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Our Categories</h1>
                <Link href={"/admin/categories/create"}
                      className={buttonVariants()}>
                    Create Category
                </Link>
            </div>
            <Suspense fallback={<AdminCategoryCardSkeletonLayout />}>
                <RenderCategories/>
            </Suspense>
        </>
    );
}

export default CategoriesPage;

async function RenderCategories() {
    const data = await adminGetCategories();

    const toCategoryCardProps = (row: {
        iconName: string | null;
        iconLib: string | null;
        title: string;
        desc: string;
        color: string | null;
        id: string;
    }) => ({
        id: row.id,
        iconName: row.iconName ?? undefined,
        iconLib: row.iconLib ?? "lucide",
        title: row.title,
        desc: row.desc,
        color: row.color ?? "muted",
    });

    return (
        <>
        {data.length === 0 ?
            <EmptyState title={"No Categories Found"}
                        description={"You don't have any category yet. Create a new category to get started."}
                        buttonText={"Create Category"}
                        href={"/admin/categories/create"}
            />
            :
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
                {data.map((category) => {
                    const props = toCategoryCardProps(category);

                    return <AdminCategoryCard key={category.id} {...props} />
                    }
                )}
        </div>
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
