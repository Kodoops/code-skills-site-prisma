import { getPage } from '@/app/data/page/get-page';
import React from 'react';
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";

type Params = Promise<{ slug: string }>;

const PageLink = async ({params}: { params: Params }) => {

    const {slug} = await params;

    const data = await getPage(slug);

    return (
        <div className={"my-6"}>
            <h2 className={"text-4xl font-bold text-center border-b-2 border-border pb-4 mb-6"}>
                {data.title}
            </h2>
           <div className="w-full">
               <RenderDescription json={JSON.parse(data.content)}/>
           </div>
        </div>
    );
};

export default PageLink;
