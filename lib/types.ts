
export type ApiResponseType = {
    status: 'error' | 'success';
    message: string;
}

/*
    Enum LEVELS : ["Beginner", "Intermediate", "Advanced", "Expert"]

    Enum Status : ["Draft", "Published", "Archived"]
 */

export type CourseType = {
    id: string,
    title: string;
    slug: string,
    smallDescription: string,
    description: string,
    fileKey: string,
    price?: number;
    duration: number,
    status: string,
    level: string;
    chapters : ChapterType[],
    category: CategoryType;
    coursePromotion: CoursePromotionType [];
    tags: TagType[];

    createdAt : string;
    updatedAt : string;
};

export type ChapterType = {
    id: string,
    title: string,
    courseId: string,
    lessons: LessonType [],
    position: number,

    createdAt : string,
    updatedAt : string,
}



export type LessonType = {
    id: string,
    title: string,
    description: string,
    public:boolean,
    chapterId: string,
    thumbnailKey: string,
    videoKey: string,
    duration: number,
    position: number,

    lessonProgress: LessonProgressType [],

    createdAt: string;
    updatedAt: string;
}

export type LessonProgressType ={
    id  : string,
    completed : boolean,
    userId   : string,
    lessonId : string,
}

export type CategoryType = {
    id: string;
    title: string;
    slug: string;
    desc: string;
    color?: string | null;
    iconName?: string | null;
    iconLib?: string | null;
    createdAt : string;
    updatedAt : string;
};

export type CategoryWithCourses = {
    id: string;
    title: string;
    slug: string;
    desc: string;
    color: string | null;
    iconName: string | null;
    iconLib: string | null;
    createdAt : string;
    updatedAt : string;
    courses: {
        id: string;
        title: string;
    }[];
};

export enum DiscountType {
    PERCENTAGE,
    FIXED,
}

export type CoursePromotionType = {
    id: string;
    title: string;
    description?: string | null;
    discount: number;
    type: string; //DiscountType;
    startsAt: Date;
    endsAt: Date;
    active: boolean;
    courseId: string
}

export type TagType = {
    id: string,
    title: string;
    slug: string,
    color: string | null;
    createdAt : string;
    updatedAt : string;
}

export type FeaturedType = {
    id: string;
    title: string;
    desc: string;
    color?: string;
    iconName?: string;
    iconLib?: string;
    className?: string;
};

export type TestimonialType = {
    name: string;
    role: string;
    text: string;
    rating?: number;
    avatar?: string;
};

export type InvoiceType = {
    id: string;
    number: string;
    // user: UserItem;
    userId: string;
    items: InvoiceItemType[];
    amount: number;// total TTC en centimes
    currency: string;
    pdfUrl?: string;
    date: string;
    createdAt: string;
}

export type InvoiceItemType = {
    id: string;
    invoiceId: string;

    // Champs communs
    title: string;
    type: string;
    referenceId: string;

    quantity: number;
    unitPrice: number; // centimes
    total: number; // unitPrice * quantity
}

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
}

enum InvoiceItemEnum {
    COURSE,
    WORKSHOP,
    SUBSCRIPTION,
}


export type EnrollmentType = {
    id :string;
    amount :number;
    status  :string;
    courseId  :string;
    userId  :string;
    paymentId?  :string;
    createdAt :string;
    updatedAt  :string;
}

// enum enrollmentStatus {
//     Pending
// Active
// Cancelled
// }


/*
DIVERS

*/


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

export const iconLibs = ["lucide"];

export type SemanticColor =
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "destructive"
    | "muted"
    | "muted-foreground"
    | "accent"
    | "orange"
    ;

