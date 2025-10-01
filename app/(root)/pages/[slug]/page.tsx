import { getPage } from '@/app/data/page/get-page';
import React from 'react';
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";

type Params = Promise<{ pageId: string }>;

const PageLink = async ({params}: { params: Params }) => {

    const {pageId} = await params;

    const data = await getPage(pageId);

    return (
        <div>
            <h2>
                {data.title}
            </h2>
            <RenderDescription json={JSON.parse(data.content)}/>
        </div>
    );
};

export default PageLink;
