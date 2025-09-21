import { getAllCategories } from "@/app/data/categories/get-all-categories";
import CreateCoursePage from "./_components/CreateCoursePage";
import {getLevels} from "@/app/data/get-levels";
import {getStatus} from "@/app/data/get-status";


export default async function CreateCoursePageWrapper() {
    const data = await getAllCategories();
    const levels : string[] = await getLevels();
    const status: string[] = await getStatus();

    const categories = data.map(category => ({
        id: category.id,
        title: category.title,
        slug: category.slug,
    }))

    return <CreateCoursePage categories={categories} levels={levels} status={status}/>;
}
