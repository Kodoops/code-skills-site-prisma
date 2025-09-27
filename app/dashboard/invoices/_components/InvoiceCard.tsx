"use client";

import React from 'react';
import {InvoiceType} from "@/lib/db/types";
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button, buttonVariants} from "@/components/ui/button";
import {EyeIcon, FileText, Minus} from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {Skeleton} from "@/components/ui/skeleton";

const InvoiceCard = ({invoice}: { invoice: InvoiceType }) => {

    const downloadInvoice = async (invoiceId: string) => {
        const response = await fetch(`/api/invoices/${invoiceId}/download`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${invoiceId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <Card>
            <CardHeader className={"border-b border-border-foreground"}>
                <CardTitle className={"text-center font-semibold"}>
                    Invoice : {invoice.number}

                </CardTitle>
            </CardHeader>
            <CardContent className={"space-y-4 mt-2"}>
                <p className={"flex items-center justify-between"}>
                    <span>Total :</span>
                    <span className={"font-bold text-xl"}>{(invoice.amount/100).toFixed(2)}
                        <span className={"ml-1 text-xs uppercase"}>{invoice.currency}</span>
                    </span>
                </p>

                <Accordion type="multiple">
                    {invoice.items.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                <p className={"flex items-center justify-between"}>
                                    <span>Content :</span>
                                    <span>{invoice.items.length} item(s)</span>
                                </p>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex items-center gap-2">
                                    <Minus className={"size-2"}/>
                                    <p>{item.title}</p>
                                </div>
                                <div
                                    className="ml-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm space-y-2 sm:space-y-0">
                                    <p>
                                        Type : <span className="text-xs">( {item.type } )</span>
                                    </p>
                                    <p>
                                        Qty : <span className="text-sm">({item.quantity})</span>
                                    </p>
                                    <p>
                                        Unit price : {(item.unitPrice/100).toFixed(2)}
                                        <span className="ml-1 text-xs uppercase"> {invoice.currency}</span>
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <div className="flex  items-center justify-center gap-4">
                    <Button className={""} onClick={() => downloadInvoice(invoice.id)}>
                    <FileText className={"size-4"}/> Donwload
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default InvoiceCard;


export function InvoiceItemCardSkeleton() {
    return <Card className={"group relative py-0 gap-0"}>

        <CardHeader className={"border-b border-border-foreground"}>
            <CardTitle className={"text-center font-semibold flex items-center justify-center"}>

                <Skeleton className={"h-6 w-4/5 rounded-full bg-muted-foreground/10 my-4"}/>

            </CardTitle>
        </CardHeader>

        <CardContent className={"p-4"}>
            <div className="space-y-2 flex items-center justify-between">
                <Skeleton className={"h-6 w-1/4 bg-muted-foreground/10 my-4"}/>
                <Skeleton className={"w-1/4 h-6 bg-muted-foreground/10 my-4"}/>
            </div>

            <div className="space-y-2 flex items-center justify-between">
                <Skeleton className={"h-6 w-1/2 bg-muted-foreground/10 my-4"}/>
                <Skeleton className={"w-1/8 h-6 bg-muted-foreground/10 my-4"}/>
            </div>


            <div className="flex itesm-center justify-center gap-4">
                <Skeleton className={buttonVariants({className: "mt-4  h-10 w-32 rounded" , variant: "outline" })}/>
            </div>
        </CardContent>
    </Card>
}
