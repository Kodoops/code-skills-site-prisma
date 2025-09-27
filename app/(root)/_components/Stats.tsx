import React from 'react';
import {Card} from "@/components/ui/card";

const Stats = () => {
    return (
        <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
                {k: "+120", v: "Leçons vidéos"},
                {k: "+30", v: "Formations"},
                {k: "100%", v: "Pratique"},
                {k: "FR/AR", v: "Langues"},
            ].map((s) => (
                <Card key={s.v} className="">
                    <div className="text-2xl font-extrabold">{s.k}</div>
                    <div className="text-xs text-muted-foreground">{s.v}</div>
                </Card>
            ))}
        </div>
    );
};

export default Stats;
