import {CourseSidebarDataType} from "@/app/data/course/get-course-sidebar-data";
import {CourseSingularType} from "@/app/data/course/get-course";

export function hasAccess(publicLesson: boolean, course: CourseSidebarDataType["course"]  | CourseSingularType) {
    if(course.price === 0 ) return true;
    // Enrollement
    if (publicLesson) return true;

    return false;
}
