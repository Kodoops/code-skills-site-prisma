import {NextResponse} from "next/server";
import {getCompanyInfos} from "@/app/data/user/get-company-infos";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";

const CompanyInfosPage = async () => {

    const company = await getCompanyInfos();

    if (!company) {
        return new NextResponse("Informations de société manquantes", {status: 500});
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Company Basic Information&#39;s</h1>
                <Link href={"/admin/company-infos/edit"}
                      className={buttonVariants()}>
                    Update Infos
                </Link>
            </div>
            <div className="">
                <Card>
                    <CardHeader>
                        <CardTitle>Company Name : {company.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start justify-start gap-6 my-6">
                            <p>Adress : </p>
                            <div className="italic space-y-2">
                                <p>{company.address}</p>
                                <p>{company.postalCode} {company.city} , {company.country}</p>
                            </div>
                        </div>
                        <Separator/>
                        <div className="my-6">
                            <p>Contact : </p>
                            <div className="flex itesm-start justify-start gap-6">
                                <div className="w-16"></div>
                                <div className="space-y-2">
                                    <p>Email : {company.email}</p>
                                    <p>Tel : {company.phone}</p>
                                </div>
                            </div>
                        </div>
                        <Separator/>
                        <div className="my-6">
                            <p> Register : </p>
                            <div className="flex itesm-start justify-start gap-6">
                                <div className="w-16"></div>
                                <div className="space-y-2">
                                    <p>V.A.T Number : {company.vatNumber}</p>
                                    <p>SIRET : {company.siret}</p>
                                </div>
                            </div>
                        </div>
                        <Separator/>
                        <div className="my-6">
                            <p> Logo : </p>
                            <div className="flex itesm-start justify-start gap-6">
                                <div className="w-16"></div>
                                <p>{company.logoUrl}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default CompanyInfosPage;

