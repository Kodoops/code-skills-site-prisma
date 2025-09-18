import { getAllCategories } from "@/app/data/categories/get-all-categories";
import FilterBar from './_components/FilterBar';
import RenderCourses from "@/app/(root)/courses/_components/RenderCourses";
import { Suspense } from "react";
import { PublicCourseCardSkeleton } from "@/app/(root)/_components/PublicCourseCard";

const COURSES_PER_PAGE = 9;

const CoursesPage = async (props: {
    searchParams?: Promise<{
        categorySlug: string | undefined;
        level?: string | undefined;
        isFree?: string | undefined;
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const categorySlug = params?.categorySlug ?? undefined;
    const level = params?.level ?? undefined;
    const isFree = params?.isFree ?? undefined;
    const page = parseInt(params?.page ?? "1", 10);

    const filters = {
        categorySlug,
        level,
        isFree,
        page,
        perPage: COURSES_PER_PAGE,
    };

    const categories = await getAllCategories();

    return (
        <div className="mt-5 space-y-4">
            <div className="flex flex-col space-y-3 mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Explore Courses</h1>
                <p className="text-muted-foreground">
                    Discover our wide range of courses designed to help you achieve your learning goal.
                </p>
            </div>

            <FilterBar
                current={{ categorySlug, level, isFree }}
                categories={categories}
            />

            <Suspense fallback={<LoadingSkeletonLayout />}>
                <RenderCourses filters={filters}  />
            </Suspense>
        </div>
    );
};

export default CoursesPage;

function LoadingSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
                <PublicCourseCardSkeleton key={index} />
            ))}
        </div>
    );
}
