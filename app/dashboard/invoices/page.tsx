import React from 'react';
import EmptyState from "@/components/general/EmptyState";
import {getAllUserInvoices} from "@/app/data/user/get-all-iInvoices";
import InvoiceCard from "@/app/dashboard/invoices/_components/InvoiceCard";
import Pagination from '@/components/general/Pagination';

const InvoicesPage = async () => {

    const {data, totalPages, currentPage, perPage} = await getAllUserInvoices();
    console.log(data, totalPages, currentPage, perPage)
    return (
        <>
            <div className="flex flex-col gap-2 mt-4">
                <h1 className={"text-3xl font-bold"}>Invoices</h1>
                <p className={"text-muted-foreground"}>
                    Here you can see all your invoices.
                </p>
            </div>

            {
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
            }
        </>
    )
}

export default InvoicesPage;
