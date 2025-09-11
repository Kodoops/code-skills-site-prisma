// components/general/Pagination.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

interface PaginationProps {
    page: number;
    totalPages: number;
}

const Pagination = ({ page, totalPages }: PaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const goToPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set("page", newPage.toString());
        router.push(`/courses?${params.toString()}`);
    };

    const getPageNumbers = () => {
        const pages: number[] = [];

        const maxVisible = 5; // nombre max de pages visibles
        const half = Math.floor(maxVisible / 2);

        let start = Math.max(1, page - half);
        let end = Math.min(totalPages, page + half);

        // Ajuste si on est proche du début ou de la fin
        if (page <= half) {
            end = Math.min(totalPages, maxVisible);
        } else if (page + half >= totalPages) {
            start = Math.max(1, totalPages - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className=" flex flex-wrap justify-center items-center gap-2 mt-12">
            <Button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                variant="outline"
                className="cursor-pointer"
            >
                Précédent
            </Button>

            {getPageNumbers().map((pageNumber) => (
                <Button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    variant={pageNumber === page ? "default" : "outline"}
                    className="cursor-pointer"
                >
                    {pageNumber}
                </Button>
            ))}

            <Button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                variant="outline"
                className="cursor-pointer"
            >
                Suivant
            </Button>
        </div>
    );
};

export default Pagination;
