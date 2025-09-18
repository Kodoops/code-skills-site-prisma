import React from 'react';
import {getAllCourses} from "@/app/data/courses/get-all-courses";
import {getAllEnrolledCoursesByUser} from "@/app/data/user/get-enrolled-courses";
import EmptyState from "@/components/general/EmptyState";
import {SearchIcon} from "lucide-react";
import Pagination from "@/components/general/Pagination";
import LearningPathCard from "@/app/(root)/learning-paths/_components/LearningPathCard";

interface PathFilters {
    categorySlug?: string;
    level?: string;
    isFree?: string;
    page: number;
    perPage: number;
}

const RenderLearningPath = async ({filters}: { filters: PathFilters }) => {
    const {data, perPage, currentPage, totalPages} = await getAllCourses(filters);

    const enrolledByUser = await getAllEnrolledCoursesByUser();
    // On extrait la liste des IDs des cours déjà suivis
    const enrolledCourseIds = enrolledByUser.map(enrollment => enrollment.course.id);

    // Liste pour debug (optionnel)
    const alreadyEnrolled: string[] = [];

    data?.map(course => {
        const isEnrolled = enrolledCourseIds.includes(course.id);
        if (isEnrolled) {
            alreadyEnrolled.push(course.id);
        }
    });


    if (data?.length === 0) {
        return (
            <EmptyState
                title="No Learning Paths Found"
                description="No learning paths found with the selected filters."
                buttonText="All Learning Paths"
                href="/learning-paths"
                icon={SearchIcon}
            />
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                {data?.map((course) => (
                    <LearningPathCard key={course.id} data={course} isEnrolled={alreadyEnrolled.includes(course.id)}/>
                ))}

            </div>

            <Pagination page={currentPage} totalPages={totalPages}/>
        </>
    );
};

export default RenderLearningPath;
