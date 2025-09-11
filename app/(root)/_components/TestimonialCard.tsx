// components/ui/TestimonialCard.tsx
import React from "react";
import Stars from "../../../components/custom-ui/Stars";

export default function TestimonialCard({
                                            name, role, text, rating = 5, avatar
                                        }: {
    name: string; role: string; text: string; rating?: number; avatar?: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Stars value={rating} />
            <p className="mt-3 text-sm text-white/90">“{text}”</p>
            <div className="mt-4 flex items-center gap-3">
                {avatar ? (
                    <img src={avatar} alt={name} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">👤</div>
                )}
                <div>
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-xs text-white/70">{role}</div>
                </div>
            </div>
        </div>
    );
}
