import React from "react";
import PublicCourseCard from "@/app/(root)/_components/PublicCourseCard";
import EmptyState from "@/components/general/EmptyState";
import {SearchIcon} from "lucide-react";
import Pagination from "@/components/general/Pagination";
import {getAllWorkshops} from "@/app/data/workshops/get-all-workshops";
import {getAllEnrolledWorkshopsByUser} from "@/app/data/user/get-enrolled-workshops";
import PublicWorkshopCard from "@/app/(root)/_components/PublicWorkshopCard";

interface WorkshopFilters {
    level?: string;
    isFree?: string;
    page: number;
    perPage: number;
}

const RenderWorkshops = async ({filters}: { filters: WorkshopFilters }) => {
    const {data, perPage, currentPage, totalPages} = await getAllWorkshops(filters);

    const enrolledByUser  = await getAllEnrolledWorkshopsByUser();
    // On extrait la liste des IDs des cours déjà suivis
    const enrolledWorkshopIds = enrolledByUser.map(enrollment => enrollment?.workshop?.id);

    // Liste pour debug (optionnel)
    const alreadyEnrolled: string[] = [];

    data?.map(workshop => {
        const isEnrolled = enrolledWorkshopIds.includes(workshop.id);
        if (isEnrolled) {
            alreadyEnrolled.push(workshop.id);
        }
    });


    if (data?.length === 0) {
        return (
            <EmptyState
                title="No Workshop Found"
                description="No workshop found with the selected filters."
                buttonText="All Workshops"
                href="/workshops"
                icon={SearchIcon}
            />
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.map((workshop) => (
                    <PublicWorkshopCard key={workshop.id} data={workshop}  isEnrolled={alreadyEnrolled.includes(workshop.id)}/>
                ))}

            </div>

            {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages}/>}
        </>
    );
};

export default RenderWorkshops;
