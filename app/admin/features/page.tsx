import {Suspense} from "react";
import {buttonVariants} from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import Link from "next/link";
import {getAllFeatures} from "@/app/data/feature/get-all-features";
import AdminFeatureCard, {AdminFeatureCardSkeleton} from "./_components/AdminFeatureCard";
import Pagination from "@/components/general/Pagination";
import {FEATURES_PER_PAGE} from "@/constants/admin-contants";


const FeaturesPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);
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
                <RenderFeatures current={page} nbrPage={FEATURES_PER_PAGE}/>
            </Suspense>
        </>
    );
}

export default FeaturesPage;

async function RenderFeatures({current, nbrPage}: { current?: number | undefined, nbrPage: number }) {

    const {data, page, perPage, total, totalPages} = await getAllFeatures(current, nbrPage);

    const toFeatureCardProps = (row: {
        iconName: string | null;
        iconLib: string | null;
        title: string;
        desc: string;
        color: string | null ;
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
                <EmptyState title={"No Feature Found"}
                            description={"You don't have any feature yet. Create a new  to get started."}
                            buttonText={"Create Feature"}
                            href={"/admin/features/create"}
                />
                :
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
                        {data.map((feature) => {
                                const props = toFeatureCardProps(feature);

                                return <AdminFeatureCard key={feature.id} {...props} />
                            }
                        )}
                    </div>
                    <Pagination page={page} totalPages={totalPages}/>
                </>
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
