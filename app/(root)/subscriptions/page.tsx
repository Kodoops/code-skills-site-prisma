import React, {Suspense} from 'react';

import {adminGetSubscriptionPlans} from "@/app/data/admin/admin-get-subscriptions-plans";
import { PLANS_PER_PAGE} from "@/constants/admin-contants";
import SubscriptionPlanCard, {
    SubscriptionCardPlanSkeleton
} from "@/app/(root)/subscriptions/_components/SubscriptionPlanCard";


const SubscriptionsPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);


    return (
        <div className="mt-5 space-y-4">
            <div className="flex flex-col space-y-3 mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Explore Subscription Plans</h1>
                <p className="text-muted-foreground">
                    Discover our subscriptions plans designed to help you achieve your learning goal.
                </p>
            </div>
            <Suspense fallback={<RenderSkeletonPlanCardLayout/>}>
                <RenderPlans current={page} nbrPage={PLANS_PER_PAGE}/>
            </Suspense>
        </div>

    )
        ;
};

export default SubscriptionsPage;


async function RenderPlans({current, nbrPage}: { current?: number | undefined, nbrPage: number }) {

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const {data: plans, totalPages, perPage, currentPage} = await adminGetSubscriptionPlans(current, nbrPage);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans?.map((plan) => {
                return <SubscriptionPlanCard key={plan.id} plan={plan}/>
            })}
        </div>
    )
}

function RenderSkeletonPlanCardLayout() {

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({length: 3}).map((_, index) => (
                <SubscriptionCardPlanSkeleton key={index} />
            ))}
        </div>
    )
}
