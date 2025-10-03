import React from 'react';
import {notFound} from "next/navigation";
import {adminGetSubscriptionPlan} from '@/app/data/admin/admin-get-subscription-plan';
import EditPlanForm from './_components/EditPlanForm';

type Params = Promise<{ planId: string }>;

const EditSubscriptionPlan = async ({params}: { params: Params }) => {

    const {planId} = await params;
    if (!planId) notFound();

    const data = await adminGetSubscriptionPlan(planId);
    if (!data) notFound();


    return (
        <EditPlanForm plan={data}/>
    );
};

export default EditSubscriptionPlan;
