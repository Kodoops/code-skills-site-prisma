"use client";

import React from 'react';
import {Button} from "@/components/ui/button";
import Link from "next/link";

import {
    Stepper,
    StepperIndicator,
    StepperItem,
    StepperSeparator,
    StepperTrigger
} from "@/components/ui/stepper";
import {useState} from "react";
import {LearningPathItemType} from "@/lib/types";
import {MiniCard} from "@/app/(root)/learning-paths/_components/MiniCard";
import {ArrowRightIcon, ChevronRightIcon} from "lucide-react";
import StartSVG from "@/components/custom-ui/StartSVG";
import CertificateSVG from "@/components/custom-ui/Certificate";
import PopOverReqObj from "@/app/(root)/learning-paths/[slug]/_component/PopOverReqObj";


export function LearningPathUserStepper({learningPathId, steps, current, prerequisites, objectives, learningPathSlug}:
                                        {
                                            learningPathId: string,
                                            steps: LearningPathItemType[], current?: number,
                                            prerequisites: { content: string, id: string }[],
                                            objectives: { content: string, id: string }[],
                                            learningPathSlug:string,
                                        }
) {

    current = current ?? -1;

    const [currentStep, setCurrentStep] = useState(current)

    function getItemUrl(item: LearningPathItemType, learningPathId: string) {

        if (item.type === "Course")
            return `/dashboard/learning-paths/${learningPathSlug}/courses/${item.course?.slug}`;

        return "/";
    }

    return (
        <div className="space-y-8 text-center px-4 ">


            <Stepper value={currentStep}
                     onValueChange={() => {
                     }}
                     orientation="vertical"
                     className="w-[100%-1.5rem-0.25rem]"
            >
                {renderSimpleStep("Start Learning", true, current >= 0)}

                <StepperItem
                    key={"start-item"}
                    step={1}
                    className="relative flex items-start justify-center not-last:flex-1 "
                >

                    <StepperTrigger className="items-start rounded pb-12 last:pb-0 w-full ">
                        <StepperIndicator/>
                        <div
                            className={`mt-0.5 px-2 text-left  gap-4 w-full border ${currentStep > 1 ? "border-primary" : "border-border"} rounded-lg p-6 ${currentStep > 1 ? "bg-primary/20" : "bg-muted"}`}>
                            <div className="space-y-3 flex flex-col md:flex-row  gap-6">
                                <div
                                    className={`flex-shrink-0 border  ${currentStep > 1 ? "border-primary" : "border-border"} rounded-full p-4`}>
                                    <StartSVG size={96}
                                              className={currentStep > 1 ? "text-primary border-primary" : "text-border"}/>
                                </div>

                                <div className="md:flex-3  ">
                                    <p className="line-clamp-4 md:line-clamp-2 p-4 text-sm ">
                                        About learning path, you have finished the learning path with success and your
                                        certificate is ready !
                                    </p>
                                    <div className="flex gap-4">

                                        {prerequisites && prerequisites.length > 0 && <PopOverReqObj title={"Prérequis"}
                                                                                                     description={"Avant de commencer ce parcours , veuillez vous assurer d'avoir les pre-requis suivants :"}
                                                                                                     currentStep={currentStep}
                                                                                                     items={prerequisites}/>}
                                        {objectives && objectives.length > 0 && <PopOverReqObj title={"Objectifs"}
                                                                                               description={"A la fin de se parcours vous aurez atteint les objectifs suivants :"}
                                                                                               currentStep={currentStep}
                                                                                               items={objectives}/>}

                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end px-6">
                                {currentStep === 1 && <Button variant="default">
                                    Mark as Completed
                                </Button>}
                            </div>
                        </div>
                    </StepperTrigger>
                    <StepperSeparator
                        className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]"/>
                </StepperItem>

                {steps.map((item, index) => {

                    return (
                        <div key={item.id}>
                            <StepperItem
                                key={item.id}
                                step={index + 2}
                                className="relative flex items-start justify-center not-last:flex-1 "
                            >

                                <StepperTrigger className="items-start rounded pb-12 last:pb-0  w-full" asChild>
                                    <div className="flex items-start gap-4 w-full">
                                        <StepperIndicator/>
                                        <div

                                            className={`mt-0.5 px-2 text-left gap-4 w-full border rounded-lg p-6 ${currentStep > index + 2 ? "border-primary" : "border-border"} ${currentStep > index + 2 ? "bg-primary/20" : "bg-muted"}`}>
                                            <div className="space-y-3 flex flex-col md:flex-row  gap-6">
                                                <div className="w-[160px]   ">
                                                    <p className={`rounded-full bg-background border ${currentStep > index + 2 ? "border-primary" : "border-border"} px-6 py-1 flex gap-4 justify-between `}>
                                                        {item.type} <ArrowRightIcon
                                                        className={`size-6 p-0.5 rounded-full border ${currentStep > index + 2 ? "border-primary" : "border-border"}`}/>
                                                    </p>
                                                </div>
                                                <div className="md:flex-2 flex-shrink-0">
                                                    {item.type === "Resource" && (
                                                        <MiniCard
                                                            title={item.resource?.title}
                                                            fileKey={item.resource?.fileKey}
                                                        />
                                                    )}
                                                    {item.type === "Workshop" && (
                                                        <MiniCard
                                                            title={item.workshop?.title}
                                                            fileKey={item.workshop?.fileKey}
                                                        />
                                                    )}
                                                    {item.type === "Course" && (
                                                        <MiniCard
                                                            title={item.course?.title}
                                                            fileKey={item.course?.fileKey}
                                                        />
                                                    )}
                                                </div>

                                                <div className="md:flex-3  ">
                                                    <p className="line-clamp-4 md:line-clamp-2 p-4 text-sm">
                                                        {item.type === "Resource" && item.resource?.description}
                                                        {item.type === "Workshop" && item.workshop?.description}
                                                        {item.type === "Course" && item.course?.smallDescription}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end px-6 gap-6">
                                                {currentStep === index + 2 &&
                                                    <Button variant="outline" className={"cursor-pointer"}>
                                                        Mark as Completed
                                                    </Button>}
                                                {currentStep >= index + 2 &&
                                                    <Link href={getItemUrl(item, learningPathId)}
                                                          className="flex gap-4 hover:bg-primary py-2 px-4 rounded-lg bg-primary/20">
                                                        Suivre <ChevronRightIcon className="size-6 "/>
                                                    </Link>}
                                            </div>
                                        </div>
                                    </div>
                                </StepperTrigger>

                                {index < steps.length && (
                                    <StepperSeparator
                                        className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]"/>
                                )}


                            </StepperItem>
                            {item.type === 'Course' &&
                                <EvaluationStep index={index + 3} key={index + 3} current={currentStep}/>}
                        </div>
                    )
                })
                }

                <EvaluationStep index={steps.length + 3} key={steps.length + 3}
                                title={"Global Learning Path Evaluation"}
                                current={currentStep}
                />

                <StepperItem
                    key={"add-item"}
                    step={steps.length + 3}
                    className="relative flex items-start justify-center not-last:flex-1 "
                >

                    <StepperTrigger className="items-start rounded pb-12 last:pb-0 w-full ">
                        <StepperIndicator/>
                        <div
                            className={`mt-0.5 px-2 text-left flex flex-col lg:flex-row gap-4 w-full border rounded-lg p-6 ${currentStep > steps.length + 3 ? "border-primary" : "border-border"} rounded-lg p-6 ${currentStep > steps.length + 3 ? "bg-primary/20" : "bg-muted"}`}>

                            <div className=" flex flex-row ">
                                <div className="  ">
                                    <p className={`rounded-full bg-background border ${currentStep > steps.length + 3 ? "border-primary" : "border-border"} px-6 py-1 flex gap-4 justify-between `}>
                                        Get Certificate
                                    </p>
                                </div>
                                <div
                                    className={`flex-shrink-0 border ${currentStep > steps.length + 3 ? "border-primary" : "border-border"} rounded-full p-2`}>
                                    <CertificateSVG size={96}
                                                    className={currentStep > steps.length + 3 ? "text-primary border-primary" : "text-border"}/>
                                </div>
                            </div>

                            <div className=" flex-3  ">
                                <p className="line-clamp-4 md:line-clamp-2 p-4 text-sm ">
                                    Congratulations, you have finished the learning path with success and your
                                    certificate is ready !
                                </p>
                            </div>
                        </div>
                    </StepperTrigger>
                    <StepperSeparator
                        className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]"/>
                </StepperItem>

                {renderSimpleStep("Finish", false, current >= steps.length + 4)}
            </Stepper>

        </div>
    )
}


export function renderSimpleStep(title: string, next = true, current = false) {
    return (
        <StepperItem
            key={title}
            step={current ? 0 : undefined}
            className="relative items-start not-last:flex-1 "
        >
            <StepperTrigger className="items-start rounded pb-12 last:pb-0 w-full">
                <StepperIndicator/>
                <div className="flex items-center w-full ">
                    <div className={`border-b ${current ? "bg-primary" : "bg-border"} border-dashed flex-1`}></div>

                    <div
                        className={`w-[200px] text-center rounded-full ${current ? "bg-primary" : "bg-muted"} border border-border px-6 py-1`}>
                        {title}
                    </div>

                    <div className={`border-b ${current ? "bg-primary" : "bg-border"} border-dashed flex-1`}></div>
                </div>
            </StepperTrigger>
            {next && <StepperSeparator
                className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]"/>}

        </StepperItem>
    )
}


export default EvaluationStep;

export function EvaluationStep({index, current, title, next}: {
    index: number,
    current: number,
    title?: string,
    next?: boolean
}) {
    next = next ?? true;
    title = title ?? "Evaluation";

    return <StepperItem
        key={index}
        step={index}
        className="relative items-start not-last:flex-1 "
    >
        <StepperTrigger className="items-start rounded pb-12 last:pb-0 w-full">
            <StepperIndicator/>
            <div className="flex items-center w-full ">
                <div
                    className={`border-b ${current > index ? "border-primary" : "border-border"} border-dashed flex-1`}></div>

                <div
                    className={`min-w-[200px] text-center rounded-full ${current > index ? "bg-primary" : "bg-muted"} border border-border px-6 py-1`}>
                    {title}
                </div>

                <div
                    className={`border-b ${current > index ? "border-primary" : "border-border"} border-dashed flex-1`}></div>
            </div>
        </StepperTrigger>
        {next && <StepperSeparator
            className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]"/>}
    </StepperItem>
}
