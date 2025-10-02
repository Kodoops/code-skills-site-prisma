import React from 'react';
import {Separator} from "@/components/ui/separator";
import Pagination from "@/components/general/Pagination";
import {MESSAGES_PER_PAGE} from '@/constants/user-contants';
import MessagesClient from "@/app/dashboard/messages/_components/MessagesClient";
import NewMessageDialog from "@/app/dashboard/messages/_components/NewMessageDialog";
import {getMessages} from "@/app/data/messages/get-messages";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import { cn } from '@/lib/utils';

const MessagesPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
        filter?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);

    const {
        data: messages,
        totalPages,
        perPage,
        currentPage
    } = await getMessages(page, MESSAGES_PER_PAGE, params?.filter);

    return (
        <div className="min-h-[calc(100vh-150px)] border border-border my-6 rounded-lg flex flex-col">
            <h2 className="text-center my-4 text-xl text-muted-foreground flex items-center justify-between">
                <div className={"flex-1 text-center"}>
                 <span> Boite de réception des messages</span>
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <span className={"font-semibold text-xs"}>Filters : </span>
                        <Link href={`/admin/messages?page=${page}&filter=`}
                              className={cn(buttonVariants({size:"sm" , variant: "secondary"}))}> All </Link>
                        <Link href={`/admin/messages?page=${page}&filter=open`}
                              className={cn(buttonVariants({size:"sm" , variant: "destructive"}))}> Open </Link>
                        <Link href={`/admin/messages?page=${page} &filter=answered`}
                              className={cn(buttonVariants({size:"sm" , variant: "default"}))}> Answered </Link>
                        <Link href={`/admin/messages?page=${page}&filter=closed`}
                              className={cn(buttonVariants({size:"sm" , variant: "outline"}))}> Closed </Link>
                    </div>
                </div>
                <NewMessageDialog/>
            </h2>

            <Separator/>

            <div className="flex flex-1 overflow-hidden">
                {messages ? <MessagesClient messages={messages} path={"/admin/messages"}/> :
                    <div className="flex w-full justify-center items-center h-full">
                        <p className="text-center text-muted-foreground text-lg">
                            Aucun message de disponible pour le moment.
                        </p>
                    </div>
                }
            </div>
            {totalPages > 1 && <div className="border-t border-border p-2">
                <Pagination totalPages={totalPages} page={page}/>
            </div>}
        </div>
    );
};

export default MessagesPage;
