import { Suspense } from "react";
import RenderLearningPath from "@/app/(root)/learning-paths/_components/RenderLearningPath";
import {LearningPathSkeletonCard} from "@/app/(root)/_components/LearningPathCard";
import LearningPathFilterBar from "./_components/LearningPathFilterBar";

const LEARNING_PATH_PER_PAGE = 2;

const LearningPathPage = async (props: {
    searchParams?: Promise<{
        pathSlug: string | undefined;
        level?: string | undefined;
        isFree?: string | undefined;
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const categorySlug = params?.pathSlug ?? undefined;
    const level = params?.level ?? undefined;
    const isFree = params?.isFree ?? undefined;
    const page = parseInt(params?.page ?? "1", 10);

    const filters = {
        level,
        isFree,
        page,
        perPage: LEARNING_PATH_PER_PAGE,
    };


    return (
        <div className="mt-5 space-y-4">
            <div className="flex flex-col space-y-3 mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Explore Learning Paths</h1>
                <p className="text-muted-foreground">
                    Discover our wide range of learning path designed to help you achieve your learning goal.
                </p>
            </div>

            <LearningPathFilterBar
                current={{ categorySlug, level, isFree }}
            />

            <Suspense fallback={<LoadingSkeletonLayout />}>
                <RenderLearningPath filters={filters}  />
            </Suspense>
        </div>
    );
};

export default LearningPathPage;

function LoadingSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
                <LearningPathSkeletonCard key={index} />
            ))}
        </div>
    );
}
