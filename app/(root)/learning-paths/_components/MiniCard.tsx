import React from 'react';

export function MiniCard({title, description}: { title: string, description: string }) {
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
