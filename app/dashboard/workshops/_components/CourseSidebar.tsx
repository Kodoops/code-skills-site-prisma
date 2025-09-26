"use client";

import React from 'react';
import {ChevronDown, Play} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import {usePathname} from "next/navigation";
import {useCourseProgress} from "@/hooks/use-course-progress";
import { hasAccess } from '@/lib/access';
import {CourseType} from '@/lib/types';
import {LessonItem, LessonLinkItem} from "@/app/dashboard/courses/_components/LessonItem";

export function CourseSidebar({course, enrolled}: {course : CourseType, enrolled: boolean}) {

    const pathname = usePathname();
    const currentLessonId = pathname.split('/').pop();
    const {totalLessons, completedLessons, progressPercentage} = useCourseProgress({courseData: course});

    return (
        <div className={"flex flex-col py-4  md:py-6 border-l-2 h-full"}>
            <div className="pb-4 px-4 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounde-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Play className={"size-5 text-primary"}/>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h1 className={"font-semibold text-base leading-tight truncate"}>{course.title}</h1>
                        <p className={"text-xs text-muted-foreground mt-1"}>{course.category?.title}</p>
                    </div>
                </div>

                <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                          <span className={"text-muted-foreground"}>Progress</span>
                          <span className={"font-medium"}>{completedLessons}/{totalLessons} lessons</span>
                      </div>

                    <Progress value={progressPercentage} className={"h-1.5"} />
                    <p className={"text-xs text-muted-foreground"}>{progressPercentage}% complete</p>
                </div>
            </div>

            <div className="py-4 pr-4 space-y-3 ">
                {course.chapters.map((chapter, index) => (
                  <Collapsible key={chapter.id} defaultOpen={index===0}>
                      <CollapsibleTrigger asChild className={"border-l-0 rounded-none rounded-r"}>
                          <Button className={"w-full p-3 h-auto flex items-center gap-2"} variant={"outline"}>
                            <div className="shrink-0">
                                <ChevronDown className={"size-4 text-primary"}/>
                            </div>
                              <div className="flex-1 text-left min-w-0">
                                  <p className="font-semibold text-sm truncate text-foreground">
                                      {chapter.position} : {chapter.title}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground font-medium truncate">
                                      {chapter.lessons.length} lessons
                                  </p>
                              </div>
                          </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className={"pt-3 pl-6  space-y-3 "}>
                          {chapter.lessons.map((lesson) => {

                              if(hasAccess(lesson.public, course, enrolled))
                                  return  <LessonLinkItem lesson={lesson}
                                                      slug={course.slug}
                                                      key={lesson.id}
                                                      isActive={currentLessonId === lesson.id}
                                                      completed={lesson.lessonProgress.find((progress) =>
                                                          progress.lessonId === lesson.id)?.completed || false}
                                  />

                              return <LessonItem lesson={lesson}
                                          slug={course.slug}
                                          key={lesson.id}
                                          isActive={currentLessonId === lesson.id}
                                          completed={lesson.lessonProgress.find((progress) =>
                                              progress.lessonId === lesson.id)?.completed || false}
                              />
                          })}
                      </CollapsibleContent>
                  </Collapsible>
                ))}
            </div>
        </div>
    );
};
