import React from "react";
import {getAllCourses} from "@/app/data/course/get-all-courses";
import PublicCourseCard from "@/app/(root)/_components/PublicCourseCard";
import EmptyState from "@/components/general/EmptyState";
import {SearchIcon} from "lucide-react";
import Pagination from "@/components/general/Pagination";

interface CourseFilters {
    categorySlug?: string;
    level?: string;
    isFree?: string;
    page: number;
    perPage: number;
}

const RenderCourses = async ({filters}: { filters: CourseFilters }) => {
    const {data, perPage, page, totalPages} = await getAllCourses(filters);

    if (data.length === 0) {
        return (
            <EmptyState
                title="No Courses Found"
                description="No courses found with the selected filters."
                buttonText="All Courses"
                href="/courses"
                icon={SearchIcon}
            />
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((course) => (
                    <PublicCourseCard key={course.id} data={course}/>
                ))}

            </div>

            <Pagination page={page} totalPages={totalPages}/>
        </>
    );
};

export default RenderCourses;
