import {CourseSidebar} from "@/app/dashboard/courses/_components/CourseSidebar";
import {getCourseSidebarData} from "@/app/data/courses/get-course-sidebar-data";
import { Suspense } from "react";

interface CourseLayoutProps {
    params: Promise<{ slug: string }>;
    children: React.ReactNode;
}

const CourseLayout = async ({params, children}: CourseLayoutProps) => {

    const {slug} = await params;

    return (
        <div className={"flex flex-1 "}>
            {/*SideBAr - 30%*/}

           <Suspense fallback={<div>Loading...</div>}>
               <RenderCourseSideBar slug={slug}/>
           </Suspense>

            {/* Main Content - 70 %*/}
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default CourseLayout;


async function RenderCourseSideBar({slug}:{slug: string}) {

    const {course, enrollment} = await getCourseSidebarData(slug);

    return (
        <div className="w-80 border-r border-border shrink-0 ">
            <CourseSidebar course={course} enrolled={enrollment?.status === 'Active'}/>
        </div>

    )
}
