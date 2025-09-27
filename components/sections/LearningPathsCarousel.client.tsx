"use client";
import React from "react";
import CarouselGrid from "../../app/(root)/_components/CarouselGrid";
import {LearningPathType} from "@/lib/db/types";
import LearningPathSimpleCard from "@/app/(root)/_components/LearningPathSimpleCard";



export default function LearningPathsCarouselClient({
                                                  items,
                                                  perPage = 2,
                                                  alreadyEnrolled
                                              }: {
    items: LearningPathType[];
    alreadyEnrolled: string[]
    perPage?: number;
}) {

    return (
        <CarouselGrid
            items={items}
            perPage={perPage}
            grid={{ baseCols: 1, smCols: 1, lgCols: 2 }}
            itemKey={(c) => c.title}
            renderItem={(c) => (

                <LearningPathSimpleCard data={c} isEnrolled={alreadyEnrolled.includes(c.id)} />
            )}
        />
    );
}
