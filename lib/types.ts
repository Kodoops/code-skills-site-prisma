import {DateTime} from "@/lib/date-time";

export type ApiResponse = {
    status: 'error' | 'success';
    message: string;
}

// Import Types from old template
export type CategoryItem = {
    id: string;
    title: string;
    slug: string;
    desc: string;
    color?: string | null;
    iconName?: string | null;
    iconLib?: string | null;
};

export type CourseItem = {
    id: string,
    title: string;
    slug: string,
    smallDescription: string,
    description: string,
    fileKey: string,
    price?: number;
    duration: number,
    level: string;
    category: CategoryItem | null;
    coursePromotion: CoursePromotionItem []

};

export enum DiscountType {
    PERCENTAGE,
    FIXED,
}

export type CoursePromotionItem = {
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

export type TagItem = {
    id: string,
    title: string;
    slug: string,
    color: string | null;
}

//SemanticColor

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

export type FeaturedItem = {
    id: string;
    title: string;
    desc: string;
    color?: string;
    iconName?: string;
    iconLib?: string;

    className?: string;
};

export type Testimonial = {
    name: string;
    role: string;
    text: string;
    rating?: number;
    avatar?: string;
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


export type InvoiceItem = {
    id: string;
    number: string;
   // user: UserItem;
    userId: string;
    items: InvoiceItemItem[];
    amount: number;// total TTC en centimes
    currency: string;
    pdfUrl?: string;
    date: string;
    createdAt: string;
}

export type InvoiceItemItem = {
    id  : string;
    invoiceId : string;

    // Champs communs
    title      : string;
    type      :  string;
    referenceId : string;

    quantity : number;
    unitPrice : number; // centimes
    total     : number; // unitPrice * quantity
}

enum InvoiceItemType {
    COURSE,
    WORKSHOP,
    SUBSCRIPTION,
}
