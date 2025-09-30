import {notFound} from "next/navigation";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowLeft} from "lucide-react";
import { getLevels } from '@/app/data/get-levels';
import {getStatus} from "@/app/data/get-status";
import {adminGetLearningPath} from "@/app/data/admin/admin-get-learning-path";
import EditLearningPathForm from './_components/EditLearningPathForm';
import LearningPathStructure from "@/app/admin/learning-paths/[id]/edit/_components/LearningPathStructure";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import LearningPathSettings from './_components/LearningPathSettings';
import {getLearningPathItemTypes} from "@/app/data/getLearningPathItemTypes";

type Params = Promise<{ id: string }>;

const LearningPathEditPage = async ({params}: { params: Params }) => {

    const {id} = await params;
    if (!id) notFound();

    const data = await adminGetLearningPath(id);
    if (!data) notFound();

    const listOfLearningPathItemTypes = await getLearningPathItemTypes();

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

    return (
        <div>
            <h1 className={"text-xl font-bold mb-8"}>
                Edit Learning Path : <span className={"text-primary underline"}>{data.title}</span>
            </h1>
            <Link href={`/admin/learning-paths`}
                  className={buttonVariants({className: "mb-6"})}>
                <ArrowLeft className={"size-4"} />Go Back
            </Link>
            <Tabs defaultValue={"basic-info"} className={"w-full"}>
                <TabsList className={"grid grid-cols-3 w-full "}>
                    <TabsTrigger value={"basic-info"}>
                        Basic Infos
                    </TabsTrigger>
                    <TabsTrigger value={"path-structure"}>
                        Learning Path Structure
                    </TabsTrigger>
                    <TabsTrigger value={"path-settings"}>
                        Learning Path settings
                    </TabsTrigger>
                </TabsList>
                <TabsContent value={"basic-info"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Infos</CardTitle>
                            <CardDescription>
                                Provide basic information about the learning path.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditLearningPathForm data={data}  levels={levels} status={status}/>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value={"path-structure"}>
                    <Card>
                        <CardHeader>
                            <CardTitle> Leaning Path Structure</CardTitle>
                            <CardDescription>
                                Here you can update your leaning path structure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LearningPathStructure data={data}  itemTypes={listOfLearningPathItemTypes} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value={"path-settings"}>
                   <LearningPathSettings tags={data.tags} id={id} requisites={prerequisites} objectives={ objectives}/>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default LearningPathEditPage;

