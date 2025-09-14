import React from "react";
import {getAllCourses} from "@/app/data/course/get-all-courses";
import PublicCourseCard from "@/app/(root)/_components/PublicCourseCard";
import EmptyState from "@/components/general/EmptyState";
import {SearchIcon} from "lucide-react";
import Pagination from "@/components/general/Pagination";
import {getAllEnrolledCoursesByUser} from "@/app/data/user/get-enrolled-courses";

interface CourseFilters {
    categorySlug?: string;
    level?: string;
    isFree?: string;
    page: number;
    perPage: number;
}

const RenderCourses = async ({filters}: { filters: CourseFilters }) => {
    const {data, perPage, page, totalPages} = await getAllCourses(filters);

    const enrolledByUser  = await getAllEnrolledCoursesByUser();
    // On extrait la liste des IDs des cours déjà suivis
    const enrolledCourseIds = enrolledByUser.map(enrollment => enrollment.course.id);

    // Liste pour debug (optionnel)
    const alreadyEnrolled: string[] = [];

    data.map(course => {
        const isEnrolled = enrolledCourseIds.includes(course.id);
        if (isEnrolled) {
            alreadyEnrolled.push(course.id);
        }
    });


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
                    <PublicCourseCard key={course.id} data={course}  isEnrolled={alreadyEnrolled.includes(course.id)}/>
                ))}

            </div>

            <Pagination page={page} totalPages={totalPages}/>
        </>
    );
};

export default RenderCourses;
