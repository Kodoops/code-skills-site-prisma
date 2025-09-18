import React from 'react';
import {AdminGetLesson} from "@/app/data/admin/admin-get-lesson";
import {LessonForm} from "@/app/admin/courses/[courseId]/[chapterId]/[lessonId]/_components/LessonForm";

type Params = Promise<{
    courseId:string,
    chapterId:string,
    lessonId:string,
}>

const LessonIdPage = async ({params}:{params:Params}) => {

    const {courseId, chapterId, lessonId} = await params;

    const lesson = await AdminGetLesson(lessonId);

    return (
        <LessonForm chapterId={chapterId} data={lesson} courseId={courseId}/>
    );
};

export default LessonIdPage;
