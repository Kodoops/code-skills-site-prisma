import React from 'react';
import {getCourseSidebarData} from "@/app/data/courses/get-course-sidebar-data";
import { redirect} from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}


const WorkshopSlugPage = async ({params}: Props) => {

    const {slug} = await params;

    const {course, enrollment} = await getCourseSidebarData(slug);


    //TODO : gérer le cas avec la sauvegarde de l'historique d'avancement, pour renvoyer user a sa dernière lecture

    // Si cours gratuit OU inscrit, on redirige vers la première leçon
    if(course.price === 0 || (enrollment && enrollment.status ==='Active')){
        const firstChapter = course.chapters[0];

        if(firstChapter) {

            const firstLesson = firstChapter.lessons[0];

            if (firstLesson) {
                redirect(`/dashboard/courses/${slug}/${firstLesson.id}`)
            }
        }
    }else{
        // Chercher la première leçon publique
        let firstPublicLesson = null;
        for (const chapter of course.chapters) {
            for (const lesson of chapter.lessons) {
                if (lesson.public) {
                    firstPublicLesson = lesson;
                    break;
                }
            }
            if (firstPublicLesson) break;
        }

        if (firstPublicLesson) {
            redirect(`/dashboard/courses/${slug}/${firstPublicLesson.id}`);
        }

    }

    return (
        <div className={"flex flex-col items-center justify-center h-full text-center "}>
            <h2 className={"text-2xl font-bold mb-2"}> No lessons available </h2>
            <p className={"text-muted-foreground"}> This course does not have a free lesson or any lessons yet !</p>
        </div>
    );
};

export default WorkshopSlugPage;
