import React from 'react';
import {Separator} from "@/components/ui/separator";
import Pagination from "@/components/general/Pagination";
import {requireUser} from "@/app/data/user/require-user";
import {getUserMessages} from "@/app/data/messages/get-user-messages";
import {MESSAGES_PER_PAGE} from '@/constants/user-contants';
import MessagesClient from "@/app/dashboard/messages/_components/MessagesClient";
import NewMessageDialog from './_components/NewMessageDialog';

const MessagesPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);
    const user = await requireUser();

    const {data:messages, totalPages, perPage, currentPage} = await getUserMessages(user.id, page, MESSAGES_PER_PAGE);

    return (
        <div className="min-h-[calc(100vh-150px)] border border-border my-6 rounded-lg flex flex-col">
            <h2 className="text-center my-4 text-xl text-muted-foreground flex items-center justify-between">
                <span className={"flex-1 text-center"}>Boite de réception des messages</span>

                <NewMessageDialog />

            </h2>
            <Separator/>

            <div className="flex flex-1 overflow-hidden">
                {messages ? <MessagesClient messages={messages} path={"/dashboard/messages"} /> :
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
