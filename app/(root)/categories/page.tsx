import React, {Suspense} from 'react';
import CategoryCard, {CategoryCardSkeleton} from "@/app/(root)/_components/CategoryCard";
import {getAllCategories} from "@/app/data/course/get-all-categories";

export const dynamic = "force-dynamic"

const CategoriesPage = () => {
    return (
        <div className=" flex-1 pt-5">
            <div className="mb-10 px-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Explore Categories</h1>
                <p className={"text-muted-foreground "}>Discover our wide range of categories grouping a courses</p>
            </div>

            <div className=" px-4 overflow-y-auto">
                <Suspense fallback={<LoadingSkeletonLayout/>}>
                    <RenderCategories/>
                </Suspense>
            </div>
        </div>
    )
        ;
};

export default CategoriesPage;


async function RenderCategories() {
    const categories = await getAllCategories();
    console.log( categories)
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
                <CategoryCard
                    key={category.id}
                    title={category.title}
                    slug={category.slug}
                    desc={category.desc}
                    iconName={category.iconName ?? undefined}
                    iconLib={category.iconLib ?? undefined}
                    color={category.color ?? undefined}
                   // count={category.count} // si tu en as un
                />
            ))}
        </div>
    )
}

function LoadingSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {Array.from({length: 16}).map((_, index) => (
                <CategoryCardSkeleton key={index}/>
            ))}
        </div>
    )
}
