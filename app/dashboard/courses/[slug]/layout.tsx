import React from 'react';
import {CourseSidebar} from "@/app/dashboard/courses/_components/CourseSidebar";
import {getCourseSidebarData} from "@/app/data/course/get-course-sidebar-data";

interface CourseLayoutProps {
    params: Promise<{ slug: string }>;
    children: React.ReactNode;
}

const CourseLayout = async ({params, children}: CourseLayoutProps) => {

    const {slug} = await params;
    const course = await getCourseSidebarData(slug);

    return (
        <div className={"flex flex-1 "}>
            {/*SideBAr - 30%*/}
            <div className="w-80 border-r border-border shrink-0 ">
                <CourseSidebar course={course.course}/>
            </div>

            {/* Main Content - 70 %*/}
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default CourseLayout;
