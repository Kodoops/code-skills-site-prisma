import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { levels } from "@/lib/types";

interface Props {
    title: string;
    btnList?: string[];
    btnListHref?: string;
    btnLink?: React.ReactNode;
}

const SectionHeader = ({ title, btnList, btnListHref, btnLink }: Props) => {
    return (
        <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h3 className="text-xl font-bold">{title}</h3>

            {btnList && (
                <div className="hidden lg:flex flex-wrap items-center gap-2 text-xs">
                    {btnList.map((item, index) => {
                        const level = levels.find((lvl) => lvl.label === item);

                        if (!level) return null;

                        return (
                            <Button
                                key={index}
                                asChild
                                variant="ghost"
                                className="rounded-xl border border-white/15 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                            >
                                <Link href={`${btnListHref}?level=${level.value}`}>{item}</Link>
                            </Button>
                        );
                    })}
                </div>
            )}

            {btnLink && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    {btnListHref && (
                        <Button
                            asChild
                            variant="ghost"
                            className="rounded-full border border-white/15 px-3 py-1 text-white/80"
                        >
                            <Link href={btnListHref}>Voir plus ...</Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SectionHeader;
