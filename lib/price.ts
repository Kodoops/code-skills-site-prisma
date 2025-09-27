import {PromotionType} from "@/lib/db/types";

export const calculatedPrice = (price: number, promotion?: PromotionType) => {

    return   promotion
        ? promotion.type === "PERCENTAGE"
            ? price! * (1 - promotion.discount / 100)
            : Math.max(price! - promotion.discount, 0)
        : price;
}
