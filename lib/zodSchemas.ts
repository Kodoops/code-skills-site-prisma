import {z} from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced", "Expert"]  as const;
export const  courseStatus =["Draft", "Published", "Archived"] as const;
export const courseCategories = [
    "Development",
    "Business",
    "Finance",
    "It Software",
    "Office Activity",
    "Design",
    "Marketing",
    "Fitness",
    "Music"
] as const;

export const courseSchema =z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}).max(100, {message:'Title must be most 100 characters long ... '}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    fileKey: z.string().min(1, {message:'File is required'}),
    price: z.coerce.number().nonnegative().min(0, {message:'Price must be minimum 0'}),
    duration: z.coerce.number().int().positive().min(1, {message:'duration  must be minimum 1 hour'}).max(500, {message:'Duration must be maximum 500  '}),
    level: z.enum(courseLevels, {message:'Level must be one of the following: beginner, intermediate, advanced'}),
    category: z.string(),
    smallDescription: z.string().min(3, {message:'Small description  must be at least 3 characters long'}).max(200, {message:'Small Description  must be most 200 characters long ... '}),
    slug: z.string().min(3, {message:'slung must be at least 3 characters long'}),
    status: z.enum(courseStatus, {message:'Status must be one of the following: draft, published, archived'}),
})

export const chapterSchema = z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}),
    courseId: z.string().uuid({message:'Course Id is required'}),
})

export const lessonSchema = z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}),
    courseId: z.string().uuid({message:'Course Id is required'}),
    chapterId: z.string().uuid({message:'Chapter Id is required'}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}).optional(),
    thumbnailKey: z.string().optional(),
    videoKey: z.string().optional(),
})

export const categorySchema = z.object({
    title: z.string().min(3, {message:'Name must be at least 3 characters long'}),
    slug: z.string().min(3, {message:'slung must be at least 3 characters long'}),
    desc: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    color: z.string().optional(),
    iconName: z.string().optional(),
    iconLib: z.string().optional(),
})

export const tagSchema = z.object({
    title: z.string().min(3, {message:'Name must be at least 3 characters long'}),
    slug: z.string().min(3, {message:'slung must be at least 3 characters long'}),
    color: z.string().optional(),
})

export type CourseSchema = z.infer<typeof courseSchema>
export type ChapterSchema = z.infer<typeof chapterSchema>
export type LessonSchema = z.infer<typeof lessonSchema>
export type CategorySchema = z.infer<typeof categorySchema>
export type TagSchema = z.infer<typeof tagSchema>
