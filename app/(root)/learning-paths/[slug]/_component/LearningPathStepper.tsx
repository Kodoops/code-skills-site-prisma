"use client";

import {
    Stepper,
    StepperIndicator,
    StepperItem,
    StepperSeparator,
    StepperTrigger
} from "@/components/ui/stepper";
import {useState} from "react";
import {LearningPathItemType} from "@/lib/db/types";
import {MiniCard} from "@/app/(root)/learning-paths/_components/MiniCard";
import {ArrowRightIcon} from "lucide-react";
import StartSVG from "@/components/custom-ui/StartSVG";
import CertificateSVG from "@/components/custom-ui/Certificate";
import {Badge} from "@/components/ui/badge";

export function LearningPathStepper({steps}: { steps: LearningPathItemType[] }) {

    const [currentStep, setCurrentStep] = useState(-1)

    return (
        <div className="space-y-8 text-center px-4 ">


            <Stepper value={currentStep}
                     onValueChange={() => {
                     }}
                     orientation="vertical"
                     className="w-[100%-1.5rem-0.25rem]"
            >
                {renderSimpleStep("Start Learning")}

                <StepperItem
                    key={"start-item"}
                    step={1}
                    className="relative flex items-start justify-center not-last:flex-1 "
                >

                    <StepperTrigger className="items-start rounded pb-12 last:pb-0 w-full ">
                        <StepperIndicator/>
                        <div
                            className="mt-0.5 px-2 text-left flex flex-col md:flex-row gap-4 w-full border rounded-lg p-6 bg-muted">
                            {/* Bloc MiniCard taille auto */}

                            <div className="flex-shrink-0 border border-border rounded-full p-4">
                                <StartSVG size={96} className="text-border"/>
                            </div>

                            {/* Bloc Description prend tout l'espace restant */}
                            <div className="md:flex-3  ">
                                <p className="line-clamp-4 md:line-clamp-2 p-4 text-sm ">
                                    About learning path, you have finished the learning path with success and your
                                    certificate is ready !
                                </p>
                                <div className="flex gap-4">
                                    <Badge variant={"outline"}
                                           className={"rounded-full bg-muted border border-border px-6 py-1 flex gap-4 justify-between"}>
                                        PreRequistes
                                    </Badge>
                                    <Badge variant={"outline"}
                                           className={"rounded-full bg-muted border border-border px-6 py-1 flex gap-4 justify-between"}>
                                        Objectives
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </StepperTrigger>
                    <StepperSeparator
                        className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]"/>
                </StepperItem>

                {steps.map((item, index) => {


                    return (
                        <>
                        <StepperItem
                            key={item.id}
                            step={index + 2}
                            className="relative flex items-start justify-center not-last:flex-1 "
                        >

                            <StepperTrigger className="items-start rounded pb-12 last:pb-0  w-full">
                                <StepperIndicator/>
                                <div
                                    className="mt-0.5 px-2 text-left flex flex-col md:flex-row gap-4 w-full border rounded-lg p-6 bg-muted">
                                    {/* Bloc MiniCard taille auto */}
                                    <div className="w-[160px]   ">
                                        <p className={"rounded-full bg-background border border-border px-6 py-1 flex gap-4 justify-between "}>
                                            {item.type} <ArrowRightIcon className={"size-6 p-0.5 rounded-full border"}/>
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

                                    {/* Bloc Description prend tout l'espace restant */}
                                    <div className="md:flex-3  ">
                                        <p className="line-clamp-4 md:line-clamp-2 p-4 text-sm">
                                            {item.type === "Resource" && item.resource?.description}
                                            {item.type === "Workshop" && item.workshop?.description}
                                            {item.type === "Course" && item.course?.smallDescription}
                                        </p>
                                    </div>
                                </div>
                            </StepperTrigger>

                            {index < steps.length && (
                                <StepperSeparator
                                    className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]"/>
                            )}

                        </StepperItem>
                            { item.type === 'Course' &&    <EvaluationStep index={index} key={index} /> }
                        </>
                    )
                })
                }

                <EvaluationStep index={steps.length + 2 } key={steps.length + 2 }  title={"Global Learning Path Evaluation"}/>

                <StepperItem
                    key={"add-item"}
                    step={steps.length + 3}
                    className="relative flex items-start justify-center not-last:flex-1 "
                >

                    <StepperTrigger className="items-start rounded pb-12 last:pb-0 w-full ">
                        <StepperIndicator/>
                        <div
                            className="mt-0.5 px-2 text-left flex flex-col lg:flex-row gap-4 w-full border rounded-lg p-6 bg-muted">

                            <div className=" flex flex-row ">
                                <div className="  ">
                                    <p className={"rounded-full bg-background border border-border px-6 py-1 flex gap-4 justify-between "}>
                                        Get Certificate
                                    </p>
                                </div>
                                <div className="flex-shrink-0 border border-border rounded-full p-2">
                                    <CertificateSVG size={96} className="text-border"/>
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

                {renderSimpleStep("Finish", false)}
            </Stepper>

        </div>
    )
}


export function renderSimpleStep(title: string, next = true) {
    return (
        <StepperItem
            key={title}
            step={undefined}
            className="relative items-start not-last:flex-1 "
        >
            <StepperTrigger className="items-start rounded pb-12 last:pb-0 w-full">
                <StepperIndicator/>
                <div className="flex items-center w-full ">
                    <div className="border-b border-border border-dashed flex-1"></div>

                    <div className="w-[200px] text-center rounded-full bg-muted border border-border px-6 py-1">
                        {title}
                    </div>

                    <div className="border-b border-border border-dashed flex-1"></div>
                </div>
            </StepperTrigger>
            {next && <StepperSeparator
                className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]"/>}

        </StepperItem>
    )
}

import React from 'react';



export default EvaluationStep;

export  function EvaluationStep({index, title, next}:{index: number, title?:string , next?:boolean}) {
    next = next ?? true;
    title = title ?? "Evaluation";

    return <StepperItem
        key={index}
        step={index + 2}
        className="relative items-start not-last:flex-1 "
    >
        <StepperTrigger className="items-start rounded pb-12 last:pb-0 w-full">
            <StepperIndicator/>
            <div className="flex items-center w-full ">
                <div className="border-b border-border border-dashed flex-1"></div>

                <div
                    className="min-w-[200px] text-center rounded-full bg-muted border border-border px-6 py-1">
                    {title}
                </div>

                <div className="border-b border-border border-dashed flex-1"></div>
            </div>
        </StepperTrigger>
        {next && <StepperSeparator
            className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]"/>}
    </StepperItem>
}
