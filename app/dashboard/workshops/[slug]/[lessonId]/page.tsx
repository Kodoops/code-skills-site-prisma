import React, {Suspense} from 'react';
import {getLessonContent} from "@/app/data/courses/get-lesson-content";
import CourseContent from "@/app/dashboard/courses/[slug]/[lessonId]/_components/CourseContent";
import {LessonSkeleton} from "@/app/dashboard/courses/[slug]/[lessonId]/_components/LessonSkeleton";

interface CourseSlugPageProps {
    params: Promise<{ lessonId: string }>;
}

const LessonContentPage = async ({params}:CourseSlugPageProps) => {

    const {lessonId} = await params;

    return (
        <Suspense fallback={<LessonSkeleton />}>
            <LessonContentLoader  lessonId={lessonId}  />
        </Suspense>
    );
};

export default LessonContentPage;

async function LessonContentLoader ({lessonId}: {lessonId: string}) {
    const lesson = await getLessonContent(lessonId);

    return  <CourseContent data={lesson}/>

}
