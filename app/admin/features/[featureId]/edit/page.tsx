import React from 'react';
import {notFound} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import EditFeatureForm from './_components/EditFeatureForm';
import {adminGetFeature} from "@/app/data/admin/admin-get-feature";

type Params = Promise<{ featureId: string }>;

const EditFeaturePage = async ({params}: { params: Params }) => {

    const {featureId} = await params;
    if (!featureId) notFound();

    const data = await adminGetFeature(featureId);
    if (!data) notFound();

    return (
        <div>
            <h1 className={"text-xl font-bold mb-8"}>
                Edit Feature : <span className={"text-primary underline"}>{data.title}</span>
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Infos</CardTitle>
                    <CardDescription>
                        Provide basic information about the feature.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EditFeatureForm  data={data}/>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditFeaturePage;
