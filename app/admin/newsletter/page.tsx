import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Pagination from '@/components/general/Pagination';
import {getNewsletterList} from "@/app/data/newsletter/get-newsletter-list";
import {CheckIcon, Trash2, X} from "lucide-react";
import Link from "next/link";
import { cn } from '@/lib/utils';
import {buttonVariants} from "@/components/ui/button";
import {NEWSLETTER_PER_PAGE} from "@/constants/admin-contants";


const NewsletterPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);

    const {data:items, perPage, totalPages, currentPage} = await getNewsletterList(page, NEWSLETTER_PER_PAGE);

    return (
        <div className="w-full p-6">
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold mb-4 border-b w-full py-2"}>Newsletter : list of subscriber</h1>

            </div>
            <Table>
                <TableHeader className="bg-transparent">
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <tbody aria-hidden="true" className="table-row h-2"></tbody>
                <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
                    {items?.map((item) => (
                        <TableRow
                            key={item.id}
                            className="odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent"
                        >
                            <TableCell className="py-2.5 font-medium">{item.name}</TableCell>
                            <TableCell className="py-2.5">{item.email}</TableCell>
                            <TableCell className="py-2.5">{item.confirmed ?
                                <CheckIcon className={"size-4 text-green-500"}/> :
                                <X className={"size-4 text-destructive"}/>
                            }
                            </TableCell>
                            <TableCell className="py-2.5 text-right">
                                <Link href={`/admin/newsletter/${item.id}/delete`}
                                      className={cn(buttonVariants({variant:"outline", className: "cursor-pointer"}))}>
                                    <Trash2 className={"size-6 text-muted-foreground/40 "}/>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <tbody aria-hidden="true" className="table-row h-2"></tbody>
            </Table>
            {totalPages > 1 && <Pagination totalPages={totalPages} page={currentPage}/>}
        </div>
    );
};

export default NewsletterPage;
