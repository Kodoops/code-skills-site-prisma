import "server-only";

import {requireAdmin} from "@/app/data/admin/require-admin";
import {prisma} from "@/lib/db";
import {notFound} from "next/navigation";
import { LessonType} from "@/lib/types";

export async function AdminGetLesson(id: string): Promise<LessonType> {

    await requireAdmin();

    const data = await prisma.lesson.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            position: true,
            thumbnailKey: true,
            videoKey: true,
            public: true,
            chapterId: true,
            duration: true,
            lessonProgress: true,
            createdAt:true,
            updatedAt:true,
        }
    });

    if (!data) return notFound();

    return {
        ...data,
        description: data.description ?? '',
        thumbnailKey: data.thumbnailKey ?? '',
        videoKey: data.videoKey ?? '',
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),
    };
}

