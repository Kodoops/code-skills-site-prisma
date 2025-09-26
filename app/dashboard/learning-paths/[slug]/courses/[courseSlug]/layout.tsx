import { Suspense } from "react";
import {getLearningPathCourseSidebarData} from "@/app/data/learning-path/get-learning-path-course-sidebar-data";
import {getLearningPath} from "@/app/data/learning-path/get-learning-path";
import {
    LearningPathCourseSidebar
} from "@/app/dashboard/learning-paths/[slug]/courses/_components/LearningPathCourseSidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";

interface CourseLayoutProps {
    params: Promise<{ slug: string, courseSlug:string }>;
    children: React.ReactNode;
}

const LearningPathCourseLayout = async ({params, children}: CourseLayoutProps) => {

    const {slug:learningPathSlug, courseSlug} = await params;
    const learningPath = await getLearningPath(learningPathSlug);

    return (
        <div className={"flex flex-1 "}>
            {/*SideBAr - 30%*/}

           <Suspense fallback={<div>Loading...</div>}>
               <RenderLearningPathCourseSideBar slug={courseSlug} learningPathId={learningPath.id} learningPathSlug={learningPathSlug}/>
           </Suspense>

            {/* Main Content - 70 %*/}
            <div className="flex-1 overflow-hidden">
              <div className="p-4">
                  <Link href={`/dashboard/learning-paths/${learningPathSlug}` }
                    className={cn(buttonVariants({className: "mb-4"}))}
                  >
                     <ArrowLeft className={"size-4"}/> Go Back Learning Path
                  </Link>
              </div>
                {children}
            </div>
        </div>
    );
};

export default LearningPathCourseLayout;


async function RenderLearningPathCourseSideBar({slug, learningPathId, learningPathSlug}:{slug: string, learningPathId: string, learningPathSlug: string}) {

    const {course, enrollment} = await getLearningPathCourseSidebarData(slug, learningPathId);

    return (
        <div className="w-80 border-r border-border shrink-0 ">
            <LearningPathCourseSidebar course={course} enrolled={enrollment?.status === 'Active'} learningPathSlug={learningPathSlug}/>
        </div>

    )
}
