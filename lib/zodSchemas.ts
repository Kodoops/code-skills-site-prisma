import {z} from "zod";

export const courseSchema =z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}).max(100, {message:'Title must be most 100 characters long ... '}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    fileKey: z.string().min(1, {message:'File is required'}),
    price: z.coerce.number().nonnegative().min(0, {message:'Price must be minimum 0'}),
    duration: z.coerce.number().int().positive().min(1, {message:'duration  must be minimum 1 hour'}).max(500, {message:'Duration must be maximum 500  '}),
    level: z.string().min(1,{message:'Level must be one of the following: beginner, intermediate, advanced'}),
    category: z.string(),
    smallDescription: z.string().min(3, {message:'Small description  must be at least 3 characters long'}).max(200, {message:'Small Description  must be most 200 characters long ... '}),
    slug: z.string().min(3, {message:'slung must be at least 3 characters long'}),
    status: z.string().min(1,{message:'Status must be one of the following: draft, published, archived'}),
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

export const featureSchema = z.object({
    title: z.string().min(3, {message:'Name must be at least 3 characters long'}),
    desc: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    color: z.string().optional(),
    iconName: z.string().optional(),
    iconLib: z.string().optional(),
})

export const companySchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    address: z.string().min(3, { message: "Address must be at least 3 characters long" }),
    city: z.string().min(2, { message: "City must be at least 2 characters long" }),
    country: z.string().min(2, { message: "Country must be at least 2 characters long" }),
    postalCode: z
        .string()
        .regex(/^\d{5}$/, { message: "Postal code must be 5 digits" }),

    email: z
        .string()
        .email({ message: "Invalid email" })
        .optional()
        .or(z.literal("")) // permet ""
        .transform((val) => (val === "" ? undefined : val)),

    phone: z
        .string()
        .min(6, { message: "Phone number must be valid" })
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),

    vatNumber: z
        .string()
        .min(5, { message: "VAT number must be valid" })
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),

    siret: z
        .string()
        .regex(/^\d{14}$/, { message: "SIRET must be 14 digits" })
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),

    logoUrl: z
        .string()
        .url({ message: "Logo URL must be a valid URL" })
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),
});

export type CourseSchema = z.infer<typeof courseSchema>
export type ChapterSchema = z.infer<typeof chapterSchema>
export type LessonSchema = z.infer<typeof lessonSchema>
export type CategorySchema = z.infer<typeof categorySchema>
export type TagSchema = z.infer<typeof tagSchema>
export type FeatureSchema = z.infer<typeof featureSchema>
export type CompanySchema = z.infer<typeof companySchema>
