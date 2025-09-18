import React from 'react';
import {notFound} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {adminGetCategory} from '@/app/data/admin/admin-get-category';
import EditCategoryForm from './_components/EditCategoryForm';
import {adminGetDomains} from "@/app/data/admin/admin-get-domains";

type Params = Promise<{ categoryId: string }>;

const EditCategoryPage = async ({params}: { params: Params }) => {

    const {categoryId} = await params;
    if (!categoryId) notFound();

    const data = await adminGetCategory(categoryId);
    if (!data) notFound();

    const domains = await adminGetDomains();

    return (
        <div>
            <h1 className={"text-xl font-bold mb-8"}>
                Edit Category : <span className={"text-primary underline"}>{data.title}</span>
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Infos</CardTitle>
                    <CardDescription>
                        Provide basic information about the category.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EditCategoryForm  data={data} domains={domains}/>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditCategoryPage;
