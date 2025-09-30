import {notFound} from "next/navigation";
import {adminGetCourse} from "@/app/data/admin/admin-get-course";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import EditCourseForm from "@/app/admin/courses/[courseId]/edit/_components/EditCourseForm";
import CourseStructure from "@/app/admin/courses/[courseId]/edit/_components/CourseStructure";
import {getAllCategories} from "@/app/data/categories/get-all-categories";
import { getLevels } from '@/app/data/get-levels';
import {getStatus} from "@/app/data/get-status";
import CourseSettings from "@/app/admin/courses/[courseId]/edit/_components/CourseSettings";
import {adminGetChaptersQuiz} from "@/app/data/courses/get-chapters-quiz";

type Params = Promise<{ courseId: string }>;

const Page = async ({params}: { params: Params }) => {

    const {courseId} = await params;
    if (!courseId) notFound();

    const data = await adminGetCourse(courseId);
    if (!data) notFound();

    const {prerequisites: preqs, objectives: objs} = data;

    const prerequisites = preqs.map(preq => {
        return {
            content: preq.prerequisite.content,
            id: preq.prerequisite.id,
        }
    });
    const objectives =  objs.map(obj => {
        return {
            content: obj.objective.content,
            id: obj.objective.id,
        }
    });

    const levels : string[] = await getLevels();
    const status: string[] = await getStatus();

    const catData = await getAllCategories();
    const categories = catData.map(category => ({
        id: category.id,
        title: category.title,
        slug: category.slug,
    }))

    const ids= data.chapters.map(chapter => chapter.id);
    const quizzes = await adminGetChaptersQuiz(ids);


    return (
        <div>
            <h1 className={"text-xl font-bold mb-8"}>
                Edit Course : <span className={"text-primary underline"}>{data.title}</span>
            </h1>
            <Tabs defaultValue={"basic-info"} className={"w-full"}>
                <TabsList className={"grid grid-cols-3 w-full "}>
                    <TabsTrigger value={"basic-info"}>
                        Basic Infos
                    </TabsTrigger>
                    <TabsTrigger value={"course-structure"}>
                        Course Structure
                    </TabsTrigger>
                    <TabsTrigger value={"course-settings"}>
                        Course settings
                    </TabsTrigger>
                </TabsList>
                <TabsContent value={"basic-info"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Infos</CardTitle>
                            <CardDescription>
                                Provide basic information about the course.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditCourseForm data={data} categories={categories} levels={levels} status={status}/>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value={"course-structure"}>
                    <Card>
                        <CardHeader>
                            <CardTitle> Course Structure</CardTitle>
                            <CardDescription>
                                Here you can update your course structure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CourseStructure data={data} quizzes={quizzes} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value={"course-settings"}>

                    <CourseSettings tags={data.tags} id={data.id} requisites={prerequisites} objectives={ objectives} />

                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Page;
