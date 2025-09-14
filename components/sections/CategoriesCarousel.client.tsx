"use client";
import React from "react";
import {CategoryType} from "@/lib/types";
import CarouselGrid from "../../app/(root)/_components/CarouselGrid";
import CategoryCard from "@/app/(root)/_components/CategoryCard";


export default function CategoriesCarouselClient({
                                                     items,
                                                     perPage = 4,
                                                 }: {
    items: CategoryType[];
    perPage?: number;
}) {
    return (
        <CarouselGrid
            items={items}
            perPage={perPage}
            grid={{ baseCols: 2, smCols: 4, lgCols: perPage }}
            itemKey={(c) => c.title}
            renderItem={(c) => (
                <CategoryCard
                    title={c.title}
                    desc={c.desc}
                    slug={ c.slug}
                    iconName={c.iconName}
                    iconLib={c.iconLib}
                    color={c.color}
                    //count={c.count}
                />
            )}
        />
    );
}
