import React, {Suspense} from 'react';
import Link from "next/link";
import { buttonVariants} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import AdminPlanCard, { AdminCardPlanSkeleton } from "@/app/admin/plans/_components/AdminPlanCard";
import {adminGetSubscriptionPlans} from "@/app/data/admin/admin-get-subscriptions-plans";
import { PLANS_PER_PAGE} from "@/constants/admin-contants";


const PlansPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);


    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Our Subscription Plans</h1>
                <Link href={"/admin/plans/create"}
                      className={buttonVariants()}>
                    <PlusIcon className={"size-4"}/> Create Plan
                </Link>
            </div>
            <Suspense fallback={<RenderSkeletonPlanCardLayout />}>
                <RenderPlans current={page} nbrPage={PLANS_PER_PAGE} />
            </Suspense>
        </>

    )
        ;
};

export default PlansPage;


async function RenderPlans({current, nbrPage}:{current?: number | undefined, nbrPage: number}) {

    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const {data:plans, totalPages, perPage, currentPage}  = await adminGetSubscriptionPlans(current , nbrPage);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans?.map((plan) => {
                return <AdminPlanCard key={plan.id} plan={plan}/>
            })}
        </div>
    )
}

function RenderSkeletonPlanCardLayout() {

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({length: 3}).map((_, index) => (
            <AdminCardPlanSkeleton key={index} />
            ))}
        </div>
    )
}
