import {} from "@/app/data/course/get-course-sidebar-data";
import {CourseSingularType} from "@/app/data/course/get-course";
import {CourseType} from "@/lib/types";

export function hasAccess(publicLesson: boolean, course: CourseType  | CourseSingularType) {

    if(course.price === 0 ) return true;
    // Enrollement
    if (publicLesson) return true;

    return false;
}
