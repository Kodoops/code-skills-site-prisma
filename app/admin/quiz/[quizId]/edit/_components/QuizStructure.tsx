"use client";

import React, { useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {CheckIcon, ChevronDownIcon, ChevronRightIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {DeleteQuizQuestion} from './DeleteQuizQuestion';
import {QuizType} from "@/lib/db/types";
import {NewQuestionModal} from "@/app/admin/quiz/[quizId]/edit/_components/NewQuestionModal";
import {DeleteQuestionOption} from "@/app/admin/quiz/[quizId]/edit/_components/DeleteQuestionOption";
import {NewQuestionOption} from "@/app/admin/quiz/[quizId]/edit/_components/NewQuestionOption";

interface Props {
    data: QuizType
}


const QuizStructure = ({data}: Props) => {

        const initialItems = data?.questions.map((question) => (
            {
                id: question.id,
                title: question.question,
                isOpen: true, // default chapters to open
                options: question.options.map((option) => ({
                    id: option.id,
                    title: option.content,
                    isCorrect: option.isCorrect,
                })),
            }
        )) || [];

        const [items, setItems] = useState(initialItems);

        useEffect(() => {
            setItems((prevItems) => {
                const updatedItems = data?.questions.map((question) => ({
                    id: question.id,
                    title: question.question,
                    isOpen: prevItems.find((item) => item.id === question.id)?.isOpen ?? true, // default chapters to open
                    options: question.options.map((option) => ({
                        id: option.id,
                        title: option.content,
                        isCorrect: option.isCorrect,
                    })),
                })) || [];

                return updatedItems;
            });
        }, [data]);



        function toggleChapter(chapterId: string) {
            setItems(
                items.map((chapter) => chapter.id === chapterId ? {...chapter, isOpen: !chapter.isOpen} : chapter)
            )
        }

        return (
            <Card>
                <CardHeader className={"flex flex-row items-center justify-between border-b border-border"}>
                    <CardTitle>Questions</CardTitle>
                    {data && <NewQuestionModal quizId={data.id}/>}
                </CardHeader>
                <CardContent className={"space-y-4"}>
                    {items.map((item) => (
                        <Card key={item.id}>
                            <Collapsible open={item.isOpen} onOpenChange={() => toggleChapter(item.id)}>
                                <div
                                    className="flex items-center justify-between p-3 border-b border-border">
                                    <div className="flex items-center gap-2">

                                        <CollapsibleTrigger asChild>
                                            <Button size={"icon"} variant={"ghost"}
                                                    className={"flex items-center"}>
                                                {item.isOpen ? <ChevronDownIcon className={"size-4"}/>
                                                    : <ChevronRightIcon className={"size-4"}/>}
                                            </Button>
                                        </CollapsibleTrigger>
                                        <p className={"cursor-pointer hover:text-primary pl-2"}>{item.title}</p>
                                    </div>
                                    {data && <DeleteQuizQuestion questionId={item.id} quizId={data?.id}/>}
                                </div>

                                <CollapsibleContent>
                                    <div className="p-1">
                                        {item.options.map((option) => (
                                            <div key={option.id}
                                                className={"flex items-center justify-between p-2 rounded-sm"}>
                                                    <p className={"flex items-center gap-2"}>
                                                        {option.title}
                                                        {option.isCorrect=== true && <CheckIcon  className={"size-4 text-primary"}/>}
                                                    </p>
                                                {data && <DeleteQuestionOption questionId={item.id}
                                                                       quizId={data?.id}
                                                                       optionId={option.id}/>}
                                            </div>
                                        ))}
                                        <div className="p-2">
                                            {data &&
                                                <NewQuestionOption questionId={item.id} quizId={data?.id}/>}
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        );
    }
;

export default QuizStructure;
