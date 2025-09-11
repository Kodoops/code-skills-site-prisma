"use client";
import React from "react";
import { Testimonial} from "@/lib/types";
import CarouselGrid from "../../app/(root)/_components/CarouselGrid";
import TestimonialCard from "../../app/(root)/_components/TestimonialCard";


export default function TestimonialCarouselClient({
                                                   items,
                                                   perPage = 3,
                                               }: {
    items: Testimonial[];
    perPage?: number;
}) {
    return (
        <CarouselGrid
            items={items}
            perPage={perPage}
            grid={{baseCols: 1, smCols: 2, lgCols: 3}}
            itemKey={(c) => c.name}
            renderItem={(c) => (

                <TestimonialCard
                    name={c.name}
                    role={c.role}
                    rating={c.rating}
                    text={c.text}
                    avatar={c.avatar}
                />
            )}
        />
    );
}
