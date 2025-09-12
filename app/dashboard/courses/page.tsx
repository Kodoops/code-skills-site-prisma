import {getEnrolledCourses} from "@/app/data/user/get-enrolled-courses";
import EmptyState from "@/components/general/EmptyState";
import CourseProgressCard from "@/app/dashboard/courses/_components/CourseProgressCard";
import Pagination from "@/components/general/Pagination";


export default async function DashboardPage() {

    const {data:enrolledCourses, totalPages, perPage, currentPage} = await getEnrolledCourses();

    return (
        <>
            <div className="flex flex-col gap-2 mt-4">
                <h1 className={"text-3xl font-bold"}>Enrolled Courses</h1>
                <p className={"text-muted-foreground"}>
                    Here you can see all the courses you have enrolled in.
                </p>
            </div>

            {
                enrolledCourses.length === 0 ? (
                    <EmptyState
                        title={"No Courses Found"}
                        description={"You don't have any courses yet. Enroll in a course to get started."}
                        buttonText={"Enroll in a Course"}
                        href={"/courses"}
                    />
                ) : (
                    <>
                        <Pagination page={currentPage} totalPages={totalPages}/>

                        <div className={"grid grid-cols-1 md:grid-cols-3 gap-6"}>
                            {enrolledCourses.map((course) => (
                                <CourseProgressCard key={course.course.id} data={course}/>
                            ))}
                        </div>

                    </>
                )
            }
        </>
    )
}
