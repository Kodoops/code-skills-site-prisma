import React from 'react';
import {getCourseSidebarData} from "@/app/data/courses/get-course-sidebar-data";
import { redirect} from "next/navigation";
import {getLearningPathCourseSidebarData} from "@/app/data/learning-path/get-learning-path-course-sidebar-data";
import {getLearningPath} from "@/app/data/learning-path/get-learning-path";

interface Props {
    params: Promise<{ slug: string, courseSlug:string }>;
}


const LearningPathCourseSlugPage = async ({params}: Props) => {

    const {slug: learningPathSlug, courseSlug} = await params;
    const learningPath = await getLearningPath(learningPathSlug);

    const {course, enrollment} = await getLearningPathCourseSidebarData(courseSlug, learningPath.id);

    //TODO : gérer le cas avec la sauvegarde de l'historique d'avancement, pour renvoyer user a sa dernière lecture
    // Si cours gratuit OU inscrit, on redirige vers la première leçon

    if(course.price === 0 || (enrollment && enrollment.status ==='Active')){
        const firstChapter = course.chapters[0];

        if(firstChapter) {

            const firstLesson = firstChapter.lessons[0];

            if (firstLesson) {
                redirect(`/dashboard/learning-paths/${learningPathSlug}/courses/${courseSlug}/${firstLesson.id}`)
            }
        }
    }
    return (
        <div className={"flex flex-col items-center justify-center h-full text-center "}>
            <h2 className={"text-2xl font-bold mb-2"}> No lessons available </h2>
            <p className={"text-muted-foreground"}> This Learning path does not have a free lesson or any lessons yet !</p>
        </div>
    );
};

export default LearningPathCourseSlugPage;
