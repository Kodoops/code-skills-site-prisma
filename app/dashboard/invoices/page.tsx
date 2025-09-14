import React, {Suspense} from 'react';
import EmptyState from "@/components/general/EmptyState";
import {getAllUserInvoices} from "@/app/data/user/get-all-iInvoices";
import InvoiceCard, {InvoiceItemCardSkeleton} from "@/app/dashboard/invoices/_components/InvoiceCard";
import Pagination from '@/components/general/Pagination';
import { INVOICES_PER_PAGE} from "@/constants/user-contants";
import {PublicCourseCardSkeleton} from "@/app/(root)/_components/PublicCourseCard";

const InvoicesPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);



    return (
        <>
            <div className="flex flex-col gap-2 mt-4">
                <h1 className={"text-3xl font-bold"}>Invoices</h1>
                <p className={"text-muted-foreground"}>
                    Here you can see all your invoices.
                </p>
            </div>

            <Suspense fallback={<InvoiceCardSkeletonLayout/>}>
                <RenderInvoices current={page} nbrPage={INVOICES_PER_PAGE}/>
            </Suspense>
        </>
    )
}

export default InvoicesPage;

async function RenderInvoices({current, nbrPage}: { current?: number | undefined, nbrPage: number }) {

    const {data, totalPages, perPage, currentPage} = await getAllUserInvoices(current, nbrPage);

    return (
        data.length === 0 ? (
            <EmptyState
                title={"No Invoices Found"}
                description={"You don't have any invoice yet."}
                buttonText={"Enroll in a Course ..."}
                href={"/courses"}
            />
        ) : (
            <>
                <div className={"grid grid-cols-1 md:grid-cols-3 gap-6"}>
                    {data.map((invoice) => (
                        <InvoiceCard key={invoice.id} invoice={invoice}/>
                    ))}
                </div>
                <Pagination page={currentPage} totalPages={totalPages}/>
            </>
        )
    )
}


function InvoiceCardSkeletonLayout() {
    return (
        <div className={"grid grid-cols-1 md:grid-cols-3 gap-6"}>
            {Array.from({length: 6}).map((_, index) => (
                <InvoiceItemCardSkeleton key={index}/>
            ))}
        </div>
    )

}
