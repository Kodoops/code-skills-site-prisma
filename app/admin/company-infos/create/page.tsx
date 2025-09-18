import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {getCompanyInfos} from "@/app/data/user/get-company-infos";
import CreateCompanyInfosForm from "@/app/admin/company-infos/create/_component/CreateCompanyInfosForm";


const CreateCompanyPage = async () => {


    const data = await getCompanyInfos();

    return (
        <div>
            <h1 className={"text-xl font-bold mb-8"}>
                Create Company : <span className={"text-primary underline"}>{data?.name}</span>
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
                       <CreateCompanyInfosForm />
                    }
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateCompanyPage;
