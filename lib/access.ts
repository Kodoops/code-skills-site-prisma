import {CourseType} from "@/lib/db/types";

export function hasAccess(publicLesson: boolean, course: CourseType , enrolled: boolean) {

    if(course.price === 0 || enrolled) return true;
    // Enrollement
    if (publicLesson) return true;

    return false;
}
