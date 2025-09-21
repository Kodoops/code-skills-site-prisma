import {z} from "zod";

export const learningPathSchema =z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}).max(100, {message:'Title must be most 100 characters long ... '}),
    smallDescription: z.string().min(3, {message:'Small description  must be at least 3 characters long'}).max(200, {message:'Small Description  must be most 200 characters long ... '}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    fileKey: z.string().min(1, {message:'File is required'}),
    price: z.coerce.number().nonnegative().min(0, {message:'Price must be minimum 0'}),
    duration: z.coerce.number().int().positive().min(1, {message:'duration  must be minimum 1 hour'}).max(500, {message:'Duration must be maximum 500  '}),
    level: z.string().min(1,{message:'Level must be one of the following: beginner, intermediate, advanced'}),
    slug: z.string().min(3, {message:'Slug must be at least 3 characters long'}),
    status: z.string().min(1,{message:'Status must be one of the following: draft, published, archived'}),
})

export const learningPathItemSchema =z.object({
    type: z.string().min(1, {message:'Type required '}),
    courseId: z.string().optional(),
    workshopId: z.string().optional(),
    resourceId: z.string().optional(),
    learningPathId: z.string().min(1, {message:'Learning Path  Id  required '}),
})

export const courseSchema =z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}).max(100, {message:'Title must be most 100 characters long ... '}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    fileKey: z.string().min(1, {message:'File is required'}),
    price: z.coerce.number().nonnegative().min(0, {message:'Price must be minimum 0'}),
    duration: z.coerce.number().int().positive().min(1, {message:'duration  must be minimum 1 hour'}).max(500, {message:'Duration must be maximum 500  '}),
    level: z.string().min(1,{message:'Level must be one of the following: beginner, intermediate, advanced'}),
    category: z.string(),
    smallDescription: z.string().min(3, {message:'Small description  must be at least 3 characters long'}).max(200, {message:'Small Description  must be most 200 characters long ... '}),
    slug: z.string().min(3, {message:'Slug must be at least 3 characters long'}),
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

export const workshopSchema =z.object({
    title: z.string().min(3, {message:'Title must be at least 3 characters long'}).max(100, {message:'Title must be most 100 characters long ... '}),
    description: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    statement: z.string().optional(),
    fileKey: z.string().min(1, {message:'File is required'}),
    price: z.coerce.number().nonnegative().min(0, {message:'Price must be minimum 0'}),
    duration: z.coerce.number().int().positive().min(1, {message:'duration  must be minimum 1 hour'}).max(500, {message:'Duration must be maximum 500  '}),
    level: z.string().min(1,{message:'Level must be one of the following: beginner, intermediate, advanced'}),
    slug: z.string().min(3, {message:'Slug must be at least 3 characters long'}),
    status: z.string().min(1,{message:'Status must be one of the following: draft, published, archived'}),
})

export const workshopStatementSchema =z.object({
    statement: z.string().min(3, {message:'Statement must be at least 3 characters long'}),
    statementsStartFileKey: z.string().optional(),
    statementVideoKey: z.string().optional(),
//to delete
    solutionFileKey: z.string().optional(),
})

export const categorySchema = z.object({
    title: z.string().min(3, {message:'Name must be at least 3 characters long'}),
    slug: z.string().min(3, {message:'slung must be at least 3 characters long'}),
    desc: z.string().min(3, {message:'Description must be at least 3 characters long'}),
    color: z.string().optional(),
    iconName: z.string().optional(),
    iconLib: z.string().optional(),
    domain: z.string(),
})

export const domainSchema = z.object({
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

export const socialLinkSchema = z.object({
    name: z.string().min(3, {message:'Name must be at least 3 characters long'}),

    iconName: z.string(),
    iconLib: z.string(),
})

export const companySocialLinkSchema = z.object({
    url: z.string()
        .url({ message: " URL must be a valid URL" })
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),
    socialLinkId: z.string().min(1, {message:'Social Network required'}),
})

export type LearningPathSchema = z.infer<typeof learningPathSchema>
export type LearningPathItemSchema = z.infer<typeof learningPathItemSchema>
export type CourseSchema = z.infer<typeof courseSchema>
export type ChapterSchema = z.infer<typeof chapterSchema>
export type LessonSchema = z.infer<typeof lessonSchema>
export type WorkshopSchema = z.infer<typeof workshopSchema>
export type WorkshopStatementSchema = z.infer<typeof workshopStatementSchema>

export type CategorySchema = z.infer<typeof categorySchema>
export type DomainSchema = z.infer<typeof domainSchema>
export type TagSchema = z.infer<typeof tagSchema>
export type FeatureSchema = z.infer<typeof featureSchema>
export type CompanySchema = z.infer<typeof companySchema>
export type SocialLinkSchema = z.infer<typeof socialLinkSchema>
export type CompanySocialLinkSchema = z.infer<typeof companySocialLinkSchema>
