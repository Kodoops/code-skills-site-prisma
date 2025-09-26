import React, {Suspense} from 'react';
import CourseContent from "@/app/dashboard/courses/[slug]/[lessonId]/_components/CourseContent";
import {LessonSkeleton} from "@/app/dashboard/courses/[slug]/[lessonId]/_components/LessonSkeleton";
import {getLearningPathLessonContent} from "@/app/data/learning-path/get-learning-path-lesson-content";
import {getLearningPath} from "@/app/data/learning-path/get-learning-path";

interface CourseSlugPageProps {
    params: Promise<{ lessonId: string, slug:string }>;
}

const LessonContentPage = async ({params}:CourseSlugPageProps) => {

    const {lessonId, slug} = await params;

    const learningPath = await getLearningPath(slug);

    return (
        <Suspense fallback={<LessonSkeleton />}>
            <LessonContentLoader  lessonId={lessonId}  learningPathId={learningPath.id} />
        </Suspense>
    );
};

export default LessonContentPage;

async function LessonContentLoader ({lessonId, learningPathId}: {lessonId: string, learningPathId: string}) {
    const lesson = await getLearningPathLessonContent(lessonId, learningPathId);

    return  <CourseContent data={lesson}/>

}
