import {getCourseLevels} from "@/app/data/get-course-levels";
import {getCourseStatus} from "@/app/data/get-course-status";
import CreateLearningPathPage from "@/app/admin/learning-paths/create/_components/CreateLearningPathPage";


export default async function CreateLearningPagePageWrapper() {

    const levels : string[] = await getCourseLevels();
    const status: string[] = await getCourseStatus();


    return <CreateLearningPathPage levels={levels} status={status}/>;
}
