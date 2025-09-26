import React from 'react';
import {getLearningPathSidebarData} from "@/app/data/courses/get-learning-path-sidebar-data";
import EmptyState from "@/components/general/EmptyState";
import {ArrowLeftIcon, BoxIcon, HouseIcon, LayoutListIcon, PanelsTopLeftIcon} from 'lucide-react';
import {LearningPathUserStepper} from "@/app/dashboard/learning-paths/[slug]/_components/LearningPathUserStepper";
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {IconChartBar, IconClock} from "@tabler/icons-react";
import {Separator} from "@/components/ui/separator";
import {Card, CardContent} from "@/components/ui/card";

interface Props {
    params: Promise<{ slug: string }>;
}


const LearningPathSlugPage = async ({params}: Props) => {

    const {slug} = await params;

    const {learningPath, enrollment} = await getLearningPathSidebarData(slug);
    const nbrOfCourses = learningPath.contents.reduce((acc, item) => item.type === "Course" ? acc + 1 : acc + 0, 0);
    const nbrOfWorkshops = learningPath.contents.reduce((acc, item) => item.type === "Workshop" ? acc + 1 : acc + 0, 0);
    const nbrOfResources = learningPath.contents.reduce((acc, item) => item.type === "Resource" ? acc + 1 : acc + 0, 0);

    const prerequisites = learningPath.prerequisites.length > 0 ? learningPath.prerequisites.map(preq => {
        return {
            content: preq.prerequisite.content,
            id: preq.prerequisite.id,
        }
    }) : [];
    const objectives = learningPath.objectives.length > 0 ? learningPath.objectives.map(obj => {
        return {
            content: obj.objective.content,
            id: obj.objective.id,
        }
    }) : [];

    //TODO : gérer le cas avec la sauvegarde de l'historique d'avancement, pour renvoyer user a sa dernière lecture

    if (learningPath.contents.length > 0) {
        return (
            <div className={"flex-1 overflow-hidden py-6"}>
                <h2 className={"text-2xl font-bold mb-2"}> {learningPath.title} </h2>

                <Tabs defaultValue="tab-1">
                    <ScrollArea>
                        <TabsList
                            className="before:bg-border relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                            <TabsTrigger
                                value="tab-1"
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                            >
                                <HouseIcon
                                    className="-ms-0.5 me-1.5 opacity-60"
                                    size={16}
                                    aria-hidden="true"
                                />
                                Basic Information&apos;s
                            </TabsTrigger>
                            <TabsTrigger
                                value="tab-2"
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                            >
                                <PanelsTopLeftIcon
                                    className="-ms-0.5 me-1.5 opacity-60"
                                    size={16}
                                    aria-hidden="true"
                                />
                                Content
                            </TabsTrigger>
                            <TabsTrigger
                                value="tab-3"
                                className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                            >
                                <BoxIcon
                                    className="-ms-0.5 me-1.5 opacity-60"
                                    size={16}
                                    aria-hidden="true"
                                />
                                Packages
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>
                    <TabsContent value="tab-1">
                        <div className="flex flex-col lg:flex-row gap-4 ">
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                                <Image src={learningPath.fileKey!}
                                       alt={learningPath.title} fill className={"object-cover"}
                                       priority
                                />
                                <div
                                    className="absolute top-5 right-5 z-10  ">
                                    <Card className={"bg-transparent p-0 border-0"}>
                                        <CardContent className={"p-0"}>
                                            <div className="space-y-3 rounded-lg bg-muted/80 p-4">
                                                <h4 className={"font-medium "}>What you will get:</h4>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                            <IconClock className={"size-4"}/>
                                                        </div>
                                                        <div className="">
                                                            <p className={"text-sm font-medium "}>Learning Path
                                                                Duration</p>
                                                            <p className={"text-sm text-muted-foreground"}>{learningPath.duration} hours </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                            <IconChartBar className={"size-4"}/>
                                                        </div>
                                                        <div className="">
                                                            <p className={"text-sm font-medium"}>Difficulty Level</p>
                                                            <p className={"text-sm text-muted-foreground"}>{learningPath.level} </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                            <LayoutListIcon className={"size-4"}/>
                                                        </div>
                                                        <div className="">
                                                            <p className={"text-sm font-medium"}>Total Items</p>
                                                            <p className={"text-sm text-muted-foreground"}>
                                                                {learningPath.contents.length} Items (
                                                                {`${nbrOfCourses} course${nbrOfCourses > 1 ? "s" : ""}, `}
                                                                {`${nbrOfWorkshops} workshop${nbrOfWorkshops > 1 ? "s" : ""}, `}
                                                                {`${nbrOfResources} resource${nbrOfResources > 1 ? "s" : ""}`}
                                                                )
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                        </div>

                        <div className="mt-8 space-y-6">
                            <div className="space-y-4">
                                <h1 className={"text-4xl font-bold tracking-tight"}>{learningPath.title}</h1>
                                <p className={"text-lg text-muted-foreground leading-relaxed line-clamp-2"}>{learningPath.smallDescription}</p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Badge className={"flex items-center gap-1 px-3 py-1"}>
                                    <IconChartBar className={"size-4"}/>
                                    <span>{learningPath.level}</span>
                                </Badge>
                                <Badge className={"flex items-center gap-1 px-3 py-1"}>
                                    <IconClock className={"size-4"}/>
                                    <span>{learningPath.duration} hours</span>
                                </Badge>
                            </div>

                            <Separator className={"my-8"}/>

                            <div className="space-y-6">
                                <h2 className={"text-3xl font-semibold tracking-tight"}>Description</h2>
                                {learningPath.tags.length > 0 && <div className=" flex flex-wrap gap-3 mt-4">
                                    <span>Tags : </span>
                                    {learningPath.tags.map((tag, index) => (
                                        <Badge className={"flex items-center gap-1 px-3 py-1"} key={tag.tag.id}
                                               variant={"outline"}>
                                            {tag.tag.title}
                                        </Badge>
                                    ))}
                                </div>}
                                <RenderDescription json={JSON.parse(learningPath.description)}/>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="tab-2">
                        <LearningPathUserStepper
                            learningPathId={learningPath.id}
                            steps={learningPath.contents}
                            current={4}
                            prerequisites={prerequisites}
                            objectives={objectives}
                            learningPathSlug={learningPath.slug}
                        />

                    </TabsContent>
                    <TabsContent value="tab-3">
                        <p className="text-muted-foreground p-4 pt-1 text-center text-xs">
                            Content for Tab 3
                        </p>
                    </TabsContent>
                </Tabs>

            </div>
        )
    } else
        return (
            <div className={"flex items-center justify-center h-full"}>
                <EmptyState
                    title={"No content available"}
                    description={"This learning path does not have any item yet !"}
                    buttonText={"Go Back"}
                    href={"/dashboard/learning-paths"}
                    icon={ArrowLeftIcon}
                />
            </div>
        )
};

export default LearningPathSlugPage;
