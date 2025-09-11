import React from 'react';

const Stats = () => {
    return (
        <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
                {k: "+120", v: "Leçons vidéos"},
                {k: "+30", v: "Formations"},
                {k: "100%", v: "Pratique"},
                {k: "FR/AR", v: "Langues"},
            ].map((s) => (
                <div key={s.v} className="rounded-xl border border-white/10 p-4">
                    <div className="text-xl font-extrabold">{s.k}</div>
                    <div className="text-xs text-white/70">{s.v}</div>
                </div>
            ))}
        </div>
    );
};

export default Stats;
