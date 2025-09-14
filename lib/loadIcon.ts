// lib/loadIcon.ts
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export function loadIcon(
    lib: string,
    name: string
): ComponentType<{ className?: string }> {
    return dynamic(() =>
            import(`react-icons/${lib}`).then((mod) => {
                const Icon =
                    mod[`Si${name}`] ||
                    mod[`Fa${name}`] ||
                    mod[`Ai${name}`] ||
                    mod[`Bs${name}`] ||
                    mod[`Md${name}`];

                if (!Icon) {
                    throw new Error(`Icon ${name} not found in library ${lib}`);
                }

                return Icon as ComponentType<{ className?: string }>;
            }),
        { ssr: false }
    );
}
