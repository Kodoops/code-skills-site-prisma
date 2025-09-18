"use client";
import React from "react";
import CarouselGrid from "../../app/(root)/_components/CarouselGrid";
import PublicCourseCard from "@/app/(root)/_components/PublicCourseCard";
import {SimpleCourse} from "@/lib/models";



export default function CoursesCarouselClient({
                                                  items,
                                                  perPage = 6,
                                                  alreadyEnrolled
                                              }: {
    items: SimpleCourse[];
    alreadyEnrolled: string[]
    perPage?: number;
}) {

    return (
        <CarouselGrid
            items={items}
            perPage={perPage}
            grid={{ baseCols: 1, smCols: 2, lgCols: 3 }}
            itemKey={(c) => c.title}
            renderItem={(c) => (

                <PublicCourseCard data={c} isEnrolled={alreadyEnrolled.includes(c.id)} />
            )}
        />
    );
}
