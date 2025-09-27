import {CategoryType, DomainType, PromotionType} from "@/lib/db/types";


export interface SimpleCourse {
    id: string,
    title: string;
    slug: string,
    smallDescription: string,
    description: string,
    fileKey: string,
    price: number;
    duration: number,
    status: string,
    level: string;
    stripePriceId: string;

    // user: UserType;
     category: CategoryType;
    // chapters: ChapterType[],
    // enrollments: EnrollmentType[];
    // payments: PaymentType[];
     promotions: PromotionType [];
    // promoCodes: PromoCodeType[];
    // tags: TagType[];
    // progress: UserProgressType[];
    // resources: CourseResourceType[];
    // learningPathItems: LearningPathItemType[];
    // objectives: CourseObjectiveType[];
    // prerequisites: CoursePrerequisiteType[];

    createdAt: string;
    updatedAt: string;
};

export type SimpleCategory = {
    id: string;
    title: string;
    slug: string;
    desc?: string | null;
    color?: string | null;
    iconName?: string | null;
    iconLib?: string | null;

    // courses: CourseType[];
    domain: DomainType;

    createdAt: string;
    updatedAt: string;
}

export type  SimpleDomain = {
    id: string;
    title: string;
    slug: string;
    desc?: string;
    color?: string | null;
    iconName?: string | null;
    iconLib?: string | null;
    // categories: CategoryType[];

    createdAt: string;
    updatedAt: string;
}
