import React from 'react';
import EmptyState from "@/components/general/EmptyState";
import {SearchIcon} from "lucide-react";
import Pagination from "@/components/general/Pagination";
import LearningPathCard from "@/app/(root)/learning-paths/_components/LearningPathCard";
import {adminGetLearningPaths} from "@/app/data/admin/admin-get-learning-paths";
import {getAllEnrolledLearningPathsByUser} from "@/app/data/user/get-enrolled-learning-paths";

interface PathFilters {
    level?: string;
    isFree?: string;
    page: number;
    perPage: number;
}

const RenderLearningPath = async ({filters}: { filters: PathFilters }) => {

    const {data, totalPages, perPage, currentPage} = await adminGetLearningPaths(filters);
    const enrolledByUser = await getAllEnrolledLearningPathsByUser();
    console.log(enrolledByUser);
    // On extrait la liste des IDs des cours déjà suivis
    const enrolledCourseIds = enrolledByUser.map(enrollment => enrollment?.learningPath?.id);

    // Liste pour debug (optionnel)
    const alreadyEnrolled: string[] = [];

    data?.map(path => {
        const isEnrolled = enrolledCourseIds.includes(path.id);
        if (isEnrolled) {
            alreadyEnrolled.push(path.id);
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
                {data?.map((learningPath, index ) => {
                    return (
                        <LearningPathCard key={index} data={learningPath}  isEnrolled={alreadyEnrolled.includes(learningPath.id)} />
                    )
                })}

            </div>

            {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages}/>}
        </>
    );
};

export default RenderLearningPath;
