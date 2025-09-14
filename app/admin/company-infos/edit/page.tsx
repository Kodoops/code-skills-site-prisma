import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import CompanyInfoForm from "@/app/admin/company-infos/edit/_components/CompanyInfosForm";
import {getCompanyInfos} from "@/app/data/user/get-company-infos";


const EditCategoryPage = async () => {


    const data = await getCompanyInfos();

    return (
        <div>
            <h1 className={"text-xl font-bold mb-8"}>
                Edit Company : <span className={"text-primary underline"}>{data?.name}</span>
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Infos</CardTitle>
                    <CardDescription>
                        Provide basic information about the category.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {
                        data ? <CompanyInfoForm data={data}/>
                    : <>
                        <p>Company information&#39;s are missing</p>
                        </>
                    }
                </CardContent>
            </Card>
        </div>
    );
};

export default EditCategoryPage;
