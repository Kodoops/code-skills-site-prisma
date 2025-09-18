import {CoursePromotionType} from "@/lib/types";

export const calculatedPrice = (price: number, promotion?: CoursePromotionType) => {

    return   promotion
        ? promotion.type === "PERCENTAGE"
            ? price! * (1 - promotion.discount / 100)
            : Math.max(price! - promotion.discount, 0)
        : price;
}
