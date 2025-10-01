export type ApiResponseType = {
    status: 'error' | 'success';
    message: string;
    // data?: T;
}

export type UploaderFileType = "image" | "video" | "file";

export type  LearningPathItemEnum = "Course" | "Workshop" | "Resource" | "Evaluation"


/* -------------------------------
ENUMS
 -------------------------------*/

export enum LevelsEnum {
    Beginner,
    Intermediate,
    Advanced,
    Expert
}

export enum StatusEnum {
    Draft,
    Published,
    Archived,
}

export enum ResourceTypeEnum {
    PDF,
    Link,
    Tool,
    Video,
}

export enum ItemTypeEnum {
    Course,
    Workshop,
    Resource,
    Evaluation,
}

export enum DiscountTypeEnum {
    PERCENTAGE,
    FIXED
}

export enum InvoiceItemEnum {
    COURSE,
    WORKSHOP,
    SUBSCRIPTION,
}

export enum EnrollmentStatusEnum {
    Pending,
    Active,
    Cancelled,
}

export enum PaymentStatusEnum {
    Succeeded,
    Pending,
    Failed,
}

export enum QuizTypeEnum {
    CHAPTER,
    COURSE,
}

export enum QuizQuestionTypeEnum {
    SINGLE_CHOICE,
    MULTIPLE_CHOICE,
    TRUE_FALSE,
}

/*-------------------------------
 MODELS : USER & AUTH
 -------------------------------*/
export type UserType = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string;
    stripeCustomerId: string;

    banned: boolean;
    banReason: string;
    banExpires: string;

    sessions: SessionType[];
    accounts: AccountType[]
    courses: CourseType[]
    enrollment: EnrollmentType[]
    lessonProgress: LessonProgressType[]
    Payment: PaymentType[]
    Invoice: InvoiceType[]

    role: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export type SessionType = {
    id: string;
    expiresAt: string;
    token: string;
    createdAt: string;
    updatedAt: string;
    ipAddress?: string;
    userAgent?: string;
    user: UserType;
    impersonatedBy: string;
}

export type AccountType = {
    id: string;
    accountId: string;
    providerId: string;
    user: UserType;
    accessToken: string;
    refreshToken: string;
    idToken: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
    scope?: string;
    password?: string;
    createdAt: string;
    updatedAt: string;
}

export type  VerificationType = {
    id: string;
    identifier: string;
    value: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
}
/*-------------------------------
 MODELS : Catalogue
 -------------------------------*/
export type  DomainType = {
    id: string;
    title: string;
    slug: string;
    desc?: string;
    color?: string | null;
    iconName?: string | null;
    iconLib?: string | null;
    categories: CategoryType[];

    createdAt: string;
    updatedAt: string;
}

export type CategoryType = {
    id: string;
    title: string;
    slug: string;
    desc?: string | null;
    color?: string | null;
    iconName?: string | null;
    iconLib?: string | null;

    courses: CourseType[];
    domain: DomainType;

    createdAt: string;
    updatedAt: string;
}

export type LearningPathType = {
    id: string;
    title: string;
    description: string;
    smallDescription: string;
    slug: string;
    fileKey?: string;
    duration: number;
    price: number // in cents
    status: string;  // ENUM_STATUS
    level: string;  // ENUM_LEVELS

    user: UserType;

    tags: LearningPathTagType[];
    contents: LearningPathItemType[];
    progress: UserProgressType[];
    resources: LearningPathResourceType[];
    objectives: LearningPathObjectiveType[];
    prerequisites: LearningPathPrerequisiteType[];

    promoCodes: PromoCodeType[];
    promotions: PromotionType[];

    enrollments: EnrollmentType[];

    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export type LearningPathItemType = {
    id: string;

    type: string;  // ENUM_ITEM_TYPE
    position: number;
    learningPath: LearningPathType;

    courseId?: string;
    workshopId?: string;
    resourceId?: string;

    course?: CourseType;
    workshop?: WorkshopType;
    resource?: ResourceType;  //ResourceTypeEnum;

    createdAt: string;
    updatedAt: string;
}

export type CourseType = {
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

    user: UserType;
    category: CategoryType;
    chapters: ChapterType[],
    enrollments: EnrollmentType[];
    payments: PaymentType[];
    promotions: PromotionType [];
    promoCodes: PromoCodeType[];
    tags: CourseTagType[];
    progress: UserProgressType[];
    resources: CourseResourceType[];
    learningPathItems: LearningPathItemType[];
    objectives: CourseObjectiveType[];
    prerequisites: CoursePrerequisiteType[];

    createdAt: string;
    updatedAt: string;
    deletedAt: string;
};

export type ChapterType = {
    id: string,
    title: string,
    position: number,
    course: CourseType,
    lessons: LessonType [],

    createdAt: string,
    updatedAt: string,
}

export type LessonType = {
    id: string,
    title: string,
    description: string,
    thumbnailKey: string,
    videoKey: string,
    position: number,
    duration: number,
    public: boolean,

    chapter: ChapterType,
    lessonProgress: LessonProgressType [],
    resources: LessonResourceType[],

    createdAt: string;
    updatedAt: string;
}

export type WorkshopType = {
    id: string;
    title: string;
    description: string;
    slug: string;
    fileKey: string;
    price: number;
    currency: number;
    duration: number;
    level: string; // ENUM_LEVELS
    status: string; // ENUM_STATUS

    statement: string;
    statementsStartFileKey?: string; // url :eip files starter kit
    statementsStartFileUrl?: string; // url :eip files starter kit
    statementVideoKey?: string;// presentation workshop video url

    solution?: string; // description of solution
    solutionFileKey?: string; // final url files solution
    solutionFileUrl?: string; // url :eip files solution
    solutionVideoKey?: string; // url video solution

    stripePriceId?: string;

    user: UserType;
    tags: WorkshopTagType[];
    progress: UserProgressType[];
    resources: WorkshopResourceType[];
    learningPathItems: LearningPathItemType[];
    objectives: WorkshopObjectiveType[];
    prerequisites: WorkshopPrerequisiteType[];

    promoCodes: PromoCodeType[];
    promotions: PromotionType[];

    enrollments: EnrollmentType[];

    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

// RESOURCES
export type ResourceType = {
    id: string;
    title: string;
    description?: string;
    type: string;   //      ResourceTypeEnum
    fileKey?: string;
    url: string;

    courseResources: CourseResourceType[];
    lessonResources: LessonResourceType[];
    workshopResources: WorkshopResourceType[];
    learningPathResources: LearningPathResourceType[];
    learningPathItems: LearningPathItemType[];

    createdAt: string;
    // updatedAt: string;
    // deletedAt: string;

    user: UserType;
}

export type LearningPathResourceType = {
    learningPathId: string;
    resourceId: string;

    LearningPath: LearningPathType;
    Resource: ResourceType;
}

export type CourseResourceType = {
    courseId: string;
    resourceId: string;

    course: CourseType;
    resource: ResourceType;

}

export type LessonResourceType = {
    lessonId: string;
    resourceId: string;

    lesson: LessonType;
    resource: ResourceType;
}

export type WorkshopResourceType = {
    workshopId: string;
    resourceId: string;
    type?: string;  // statement or solution

    workshop: WorkshopType;
    resource: ResourceType;
}

// PROGRESS

export type LessonProgressType = {
    id: string,
    completed: boolean,
    userId: string,
    lessonId: string,

    createdAt: string;
    updatedAt: string;
}

export type UserProgressType = {
    id: string,
    completed: boolean,
    userId: string,
    type: string; // ItemTypeEum
    itemId: string,

    // course   Course?       @relation("CourseProgress", fields: [itemId], references: [id], map: "fk_progress_course")
    // workshop Workshop?     @relation("WorkshopProgress", fields: [itemId], references: [id], map: "fk_progress_workshop")
    // path     LearningPath? @relation("LearningPathProgress", fields: [itemId], references: [id], map: "fk_progress_path")

    createdAt: string;
    updatedAt: string;
}

//TAGS

export type TagType = {
    id: string,
    title: string;
    slug: string,
    color: string | null;

    courseTags: CourseTagType[];
    workshopTags: WorkshopTagType[];
    learningPathTags: LearningPathTagType[];

    createdAt: string;
    updatedAt: string;
}

export type CourseTagType = {
    courseId: string;
    tagId: string;

    course: CourseType;
    tag: TagType;

}

export type WorkshopTagType = {
    workshopId: string;
    tagId: string;

    workshop: WorkshopType;
    tag: TagType;
}

export type LearningPathTagType = {
    learningPathId: string;
    tagId: string;

    learningPath: LearningPathType;
    tag: TagType;
}

// PROMOTIONS

export type  PromotionType = {
    id: string;
    title: string;
    description?: string;
    discount: number;
    type: string; //     DiscountTypeEnum
    startsAt: string;
    endsAt: string;
    active: boolean;

    itemType: string; // ItemTypeEnum

    // Clés spécifiques pour chaque relation
    courseId?: string;
    workshopId?: string;
    learningPathId?: string;

    // Relations explicites
    course: CourseType;
    workshop: WorkshopType;
    learningPath: LearningPathType;
}

export type   PromoCodeType = {
    id: string;
    code: string;
    description?: string;
    discount: number;
    type: string; //   DiscountTypeEnum
    usageLimit?: number;
    usedCount: number;
    startsAt: string;
    endsAt: string;
    active: boolean;

    applicableCourses: CourseType[];
    applicableWorkshops: WorkshopType[];
    applicableLearningPaths: LearningPathType[];
}

// QUIZ

export type  QuizType = {
    id: string;
    title: string;
    slug: string;
    description?: string;
    type?: string;
    chapterId?: string;
    courseId?: string;
    questions: QuizQuestionType[];
    createdAt: string;
    updatedAt: string;
    user: UserType;
    userId: string;
}

export type  QuizQuestionType = {
    id: string;
    question: string;
    type: string; // MULTIPLE_CHOICE, TRUE_FALSE, OPEN
    quizId: string;
    quiz: QuizType;
    options: QuizOptionType[];
}

export type  QuizOptionType = {
    id: string;
    content: string;
    isCorrect: boolean;
    questionId: string;
    question: QuizQuestionType;
}

export type  QuizResultType = {
    id: string;
    userId: string;
    quizId: string;
    score: number;
    passed: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

//PAYMENTS
export type  EnrollmentType = {
    id: string;
    amount: number;
    status: string; // EnrollmentStatusEnum

    course?: CourseType;
    learningPath?: LearningPathType;
    workshop?: WorkshopType;
    user: UserType;
    payment?: PaymentType;

    updatedAt: string;
    createdAt: string;
}

export type PaymentType = {
    id: string;
    stripeId: string;
    user: UserType;
    course?: CourseType;
    learningPath?: LearningPathType;
    workshop?: WorkshopType;
    amount: number;
    currency: string;
    status: string; // 'succeeded', 'pending', 'failed', etc.
    method?: string; // card, stripe, etc.
    receiptUrl?: string; // lien Stripe vers le reçu
    enrollment: EnrollmentType;
    createdAt: string;
    updatedAt: string;
}

// -----------------------------------
// BILLING
// -----------------------------------

export type InvoiceType = {
    id: string;
    number: string;
    user: UserType;
    // userId: string;
    items: InvoiceItemType[];
    amount: number;// total TTC en centimes
    currency: string;
    pdfUrl?: string;
    date: string;
    createdAt: string;
}

export type  InvoiceItemType = {
    id: string;
    //invoiceId: string;
    invoice: InvoiceType;
    title: string;
    type: string; // InvoiceItemEnum
    referenceId: string;
    quantity: number;
    unitPrice: number; // centimes
    total: number; // unitPrice * quantity
}

// Divers

export type  ObjectiveType = {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;

    courses: CourseObjectiveType[];
    workshops: WorkshopObjectiveType[];
    learningPaths: LearningPathObjectiveType[];
}

export type  PrerequisiteType = {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;

    courses: CoursePrerequisiteType[];
    workshops: WorkshopPrerequisiteType[];
    learningPaths: LearningPathPrerequisiteType[];
}

export type  CourseObjectiveType = {
    courseId: string;
    objectiveId: string;

    course: CourseType;
    objective: ObjectiveType;

}

export type  CoursePrerequisiteType = {
    courseId: string;
    prerequisiteId: string;

    course: CourseType;
    prerequisite: PrerequisiteType;

}

export type  WorkshopObjectiveType = {
    workshopId: string;
    objectiveId: string;

    workshop: WorkshopType;
    objective: ObjectiveType;

}

export type  WorkshopPrerequisiteType = {
    workshopId: string;
    prerequisiteId: string;

    workshop: WorkshopType;
    prerequisite: PrerequisiteType;

}

export type  LearningPathObjectiveType = {
    learningPathId: string;
    objectiveId: string;

    learningPath: LearningPathType;
    objective: ObjectiveType;

}

export type  LearningPathPrerequisiteType = {
    learningPathId: string;
    prerequisiteId: string;

    learningPath: LearningPathType;
    prerequisite: PrerequisiteType;

}

// -----------------------------------
// SITE OCNFIG
// -----------------------------------

export type FeaturedType = {
    id: string;
    title: string;
    desc: string;
    color?: string;
    iconName?: string;
    iconLib?: string;

    createdAt: string;
    updatedAt: string;
};

export type CompanyType = {
    id: string;
    name: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    email: string;
    phone?: string | null;
    siret?: string | null;
    vatNumber?: string | null;
    logoUrl?: string | null;
    createdAt: string;
    updatedAt: string;
}

export type SocialLinkType = {
    id: string;
    name: string;
    //url: string;
    iconLib: string; // ex: "lucide", "si", "fa", "tabler"
    iconName: string; // ex: "facebook", "github", "x"
    createdAt: string;
    updatedAt: string;
}

export type CompanySocialLinkType = {
    id: string;
    companyId: string;
    socialLinkId: string;
    url: string; // Lien spécifique pour entreprise
    createdAt: string;
    updatedAt: string;

    company?: CompanyType;
    socialLink?: SocialLinkType;
}

export const pageLinksTypes = ["Footer", "Page"];

export type PageType = {
    id: string;
    title: string;
    slug: string;
    content: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}

export type NewsletterSubscriptionType = {
    id: string;
    email: string;
    name?: string;
    createdAt: string;
    updatedAt: string;
    confirmed: boolean;
}


export type ContactMessageType = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string; // open, answered, closed
    createdAt: string;
    updatedAt: string;

    userId?: string;

    replies: ContactReplyType[]
}

export type ContactReplyType = {
    id: string;
    contactMessageId: string;
    contactMessage: ContactMessageType;
    adminId?: string;
    response: string;
    createdAt: string;
}

/*-------------------------------
OTHERS
-------------------------------*/

export type TestimonialType = {
    userId: string
    text: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
};

export type TestimonialWithUserType = TestimonialType & {
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image?: string | null;
    };
};


export const colorClasses: Record<string, { bg: string; text: string }> = {
    primary: {bg: "bg-primary/10", text: "text-primary"},
    secondary: {bg: "bg-secondary/10", text: "text-secondary"},
    success: {bg: "bg-emerald-500/10", text: "text-emerald-600"},
    warning: {bg: "bg-amber-500/10", text: "text-amber-600"},
    destructive: {bg: "bg-destructive/10", text: "text-destructive"},
    muted: {bg: "bg-muted", text: "text-muted-foreground"},
    "muted-foreground": {bg: "bg-muted/10", text: "text-muted-foreground"},
    accent: {bg: "bg-accent/10", text: "text-accent-foreground"},
    orange: {bg: "bg-orange", text: "text-orange-foreground"}
};

export const levels = [
    {label: "Tous les niveaux", value: "all"},
    {label: "Débutant", value: "Beginner"},
    {label: "Intermédiaire", value: "Intermediate"},
    {label: "Avancé", value: "Advanced"},
    {label: "Expert", value: "Expert"},
];

export const levelBgColors: Record<string, string> = {
    Beginner: "bg-green-500",
    Intermediate: "bg-yellow-500",
    Advanced: "bg-red-500",
    Expert: "bg-purple-500",
}

export const listColors = Object.keys(colorClasses);

export const iconLibs = ["lucide", "si", "fa", "tabler"];

