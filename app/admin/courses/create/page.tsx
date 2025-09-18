import { getAllCategories } from "@/app/data/categories/get-all-categories";
import CreateCoursePage from "./_components/CreateCoursePage";
import {getCourseLevels} from "@/app/data/get-course-levels";
import {getCourseStatus} from "@/app/data/get-course-status";


export default async function CreateCoursePageWrapper() {
    const data = await getAllCategories();
    const levels : string[] = await getCourseLevels();
    const status: string[] = await getCourseStatus();

    const categories = data.map(category => ({
        id: category.id,
        title: category.title,
        slug: category.slug,
    }))

    return <CreateCoursePage categories={categories} levels={levels} status={status}/>;
}
