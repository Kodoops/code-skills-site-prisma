import {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import  {AdminCategoryCardSkeleton} from "@/app/admin/categories/_components/AdminCategoryCard";
import {getAllFeatures} from "@/app/data/feature/get-all-features";
import AdminFeatureCard, {AdminFeatureCardSkeleton} from "./_components/AdminFeatureCard";

const FeaturesPage = () => {

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Our Features</h1>
                <Link href={"/admin/features/create"}
                      className={buttonVariants()}>
                    Create Feature
                </Link>
            </div>
            <Suspense fallback={<AdminFeatureCardSkeletonLayout />}>
                <RenderFeatures/>
            </Suspense>
        </>
    );
}

export default FeaturesPage;

async function RenderFeatures() {
    const data = await getAllFeatures();

    const toFeatureCardProps = (row: {
        iconName: string ;
        iconLib: string ;
        title: string;
        desc: string;
        color: string ;
        id: string;
    }) => ({
        id: row.id,
        iconName: row.iconName ,
        iconLib: row.iconLib ?? "lucide",
        title: row.title,
        desc: row.desc,
        color: row.color ?? "muted",
    });

    return (
        <>
            {data.length === 0 ?
                <EmptyState title={"No Courses Found"}
                            description={"You don't have any category yet. Create a new course to get started."}
                            buttonText={"Create Category"}
                            href={"/admin/categories/create"}
                />
                :
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
                    {data.map((feature) => {
                            const props = toFeatureCardProps(feature);

                            return <AdminFeatureCard key={feature.id} {...props} />
                        }
                    )}
                </div>
            }
        </>
    )
}

function AdminFeatureCardSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length: 6}).map((_, index) => (
                <AdminFeatureCardSkeleton key={index}/>
            ))}
        </div>
    )

}
