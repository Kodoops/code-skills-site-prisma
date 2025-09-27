import Image from "next/image";
import {IconChartBar, IconClock} from "@tabler/icons-react";
import {Badge} from '@/components/ui/badge';
import {Separator} from "@/components/ui/separator";
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";
import {Card, CardContent} from "@/components/ui/card";
import {CheckIcon, LayoutListIcon} from "lucide-react";
import {checkIfLearningPathBought} from "@/app/data/user/user-is-enrolled";
import Link from 'next/link';
import {buttonVariants} from "@/components/ui/button";
import {calculatedPrice} from "@/lib/price";
import ProductPrice from "@/components/custom-ui/ProductPrice";
import {getLearningPath} from "@/app/data/learning-path/get-learning-path";
import { LearningPathStepper } from "./_component/LearningPathStepper";
import {EnrollmentButton} from "@/app/(root)/learning-paths/[slug]/_component/EnrollmentButton";
import ObjectivesAndRequisites from "@/components/custom-ui/ObjectivesAndRequisites";
import React from "react";
import AuthorBanner from "@/components/custom-ui/AuthorBanner";

type Params = Promise<{ slug: string }>

const SingleLearningPathPage = async ({params}: { params: Params }) => {
    const {slug} = await params;

    const learningPath = await getLearningPath(slug);

    const isEnrolled = await checkIfLearningPathBought(learningPath.id);

    const finalPrice = calculatedPrice(learningPath.price!, learningPath.promotions[0])

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

    return (
        <div className={"grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5"}>
            <div className="order-1 lg:col-span-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                    <Image src={learningPath.fileKey!}
                           alt={learningPath.title} fill className={"object-cover"}
                           priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
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

                    <AuthorBanner
                        name={learningPath.user.name }
                        title={learningPath.user.email}
                        description={learningPath.user.id}
                        avatar={learningPath.user.image}
                        rating={4.2}
                    />

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

                <div className="py-8">
                    <ObjectivesAndRequisites requisites={prerequisites} objectives={objectives}/>
                </div>
                <div className="mt-12 space-y-6">
                    <LearningPathStepper steps={learningPath.contents}/>
                </div>
            </div>

            {/* Enrollement Card*/}
            <div className="order-2 lg:col-span-1">
                <div className="sticky top-20">
                <Card className={"py-0"}>
                        <CardContent className={"p-6"}>
                            <div className="flex items-center justify-between mb-6">
                                <span className={"text-lg font-medium"}>Price:</span>
                                <span className={"text-2xl font-bold text-primary"}>

                                    <ProductPrice finalPrice={finalPrice} price={learningPath.price} size={"2xl"}/>
                                </span>
                            </div>

                            <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
                                <h4 className={"font-medium"}>What you will get:</h4>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <IconClock className={"size-4"}/>
                                        </div>
                                        <div className="">
                                            <p className={"text-sm font-medium"}>Learning Path Duration</p>
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

                            <div className="mb-6 space-Y-3 ">
                                <h4 className={"pb-2"}>This learning path includes:</h4>
                                <ul className={"space-y-2"}>
                                    <li className="flex items-center gap-2 text-sm">
                                        <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                                            <CheckIcon className={"size-3 "}/>
                                        </div>
                                        <span>
                                           Full lifetime access
                                       </span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                                            <CheckIcon className={"size-3 "}/>
                                        </div>
                                        <span>
                                          Access on mobile and desktop
                                       </span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm">
                                        <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                                            <CheckIcon className={"size-3 "}/>
                                        </div>
                                        <span>
                                          Certificate of completion
                                       </span>
                                    </li>
                                </ul>
                            </div>

                            {isEnrolled ?
                                <Link href={"dashboard"} className={buttonVariants({className: "w-full"})}>
                                    Watch Course
                                </Link>
                                :
                                learningPath.price === 0 ?
                                    <p className={"text-xs text-muted-foreground mt-4 text-center"}>
                                        <EnrollmentButton learningPathId={learningPath.id} btnLabel={"Enroll Free Learning Path"}/>
                                    </p>
                                    : <>
                                        <EnrollmentButton learningPathId={learningPath.id} btnLabel={"Enroll Now !"}/>
                                        <p className={"text-xs text-muted-foreground mt-4 text-center"}>
                                            30-day money-back guarantee.
                                        </p>
                                    </>
                            }

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
        ;
};

export default SingleLearningPathPage;
