import {notFound} from "next/navigation";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

import { adminGetSingleQuiz } from "@/app/data/admin/admin-get-single-quiz";
import EditQuizForm from "@/app/admin/quiz/[quizId]/edit/_components/EditQuizForm";
import QuizStructure from "@/app/admin/quiz/[quizId]/edit/_components/QuizStructure";

type Params = Promise<{ quizId: string }>;

const QuizEditPage = async ({params}: { params: Params }) => {

    const {quizId} = await params;
    if (!quizId) notFound();

    const data = await adminGetSingleQuiz(quizId);
    if (!data) notFound();

    return (
        <div>
            <h1 className={"text-xl font-bold mb-8"}>
                Edit Quiz : <span className={"text-primary underline"}>{data.title}</span>
            </h1>
            <Tabs defaultValue={"basic-info"} className={"w-full"}>
                <TabsList className={"grid grid-cols-2 w-full "}>
                    <TabsTrigger value={"basic-info"}>
                        Basic Infos
                    </TabsTrigger>
                    <TabsTrigger value={"quiz-structure"}>
                        Quiz Structure
                    </TabsTrigger>
                </TabsList>
                <TabsContent value={"basic-info"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Infos</CardTitle>
                            <CardDescription>
                                Provide basic information about the quiz.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditQuizForm data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value={"quiz-structure"}>
                    <Card>
                        <CardHeader>
                            <CardTitle> Quiz Structure</CardTitle>
                            <CardDescription>
                                Here you can update your quiz structure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <QuizStructure data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
};

export default QuizEditPage;

