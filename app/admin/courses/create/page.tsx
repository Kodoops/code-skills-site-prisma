// app/admin/courses/create/page.tsx (ou similaire selon ta structure)
import { getAllCategories } from "@/app/data/course/get-all-categories";
import CreateCoursePage from "./_components/CreateCoursePage";


export default async function CreateCoursePageWrapper() {
    const data = await getAllCategories();
    const categories = data.map(category => ({
        id: category.id,
        title: category.title,
        slug: category.slug,
    }))

    return <CreateCoursePage categories={categories} />;
}
