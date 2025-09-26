import React from 'react';

import { CircleQuestionMarkIcon, InfoIcon, Proportions} from "lucide-react";
import { checkIfWorkshopBought} from "@/app/data/user/user-is-enrolled";
import {getWorkshop} from "@/app/data/workshops/get-workshop";
import NotFound from "@/app/not-found";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import WorkshopInformation from "@/app/dashboard/workshops/[slug]/_components/WorkshopInformation";
import WorkshopStatement from "@/app/dashboard/workshops/[slug]/_components/WorkshopStatement";
import WorkshopSolution from "@/app/dashboard/workshops/[slug]/_components/Workshopsolution";

type Params = Promise<{ slug: string }>

const SingleWorkshopPage = async ({params}: { params: Params }) => {
    const {slug} = await params;

    const workshop = await getWorkshop(slug);

    const isEnrolled = await checkIfWorkshopBought(workshop.id);
    if(!isEnrolled)
        return NotFound();

    return (
        <Tabs defaultValue="tab-1">
            <ScrollArea>
                <TabsList
                    className="before:bg-border relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                    <TabsTrigger
                        value="tab-1"
                        className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                    >
                        <InfoIcon
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            aria-hidden="true"
                        />
                        Basic Information&apos;s
                    </TabsTrigger>
                    <TabsTrigger
                        value="tab-2"
                        className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                    >
                        <CircleQuestionMarkIcon
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            aria-hidden="true"
                        />
                        Statement
                    </TabsTrigger>
                    <TabsTrigger
                        value="tab-3"
                        className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                    >
                        <Proportions
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                            aria-hidden="true"
                        />
                        Solution
                    </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>
            <TabsContent value="tab-1">
                <WorkshopInformation  workshop={workshop} />
            </TabsContent>
            <TabsContent value="tab-2">
               <WorkshopStatement workshop={workshop} />
            </TabsContent>
            <TabsContent value="tab-3">
                <WorkshopSolution workshop={workshop} />
            </TabsContent>
        </Tabs>

    )
        ;
};

export default SingleWorkshopPage;

