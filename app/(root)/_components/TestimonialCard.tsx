// components/ui/TestimonialCard.tsx
import React from "react";
import Stars from "../../../components/custom-ui/Stars";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {RatingStars} from "@/components/custom-ui/RatingStars";

export default function TestimonialCard({
                                            name, role, text, rating = 5, avatar
                                        }: {
    name: string; role: string; text: string; rating?: number; avatar?: string;
}) {
    return (
        <Card className={"my-4"}>
           <CardHeader>
               <RatingStars rating={rating} />
           </CardHeader>
            <CardContent>
                <p className="mt-3 text-sm  line-clamp-2">“{text}”</p>
                <div className="mt-4 flex items-center gap-3">
                    {avatar ? (
                        <img src={avatar} alt={name} className="h-9 w-9 rounded-full object-cover"/>
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted-foreground/20">👤</div>
                    )}
                    <div>
                        <div className="text-sm font-semibold">{name}</div>
                        <div className="text-xs text-muted-foreground/70">{role}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
