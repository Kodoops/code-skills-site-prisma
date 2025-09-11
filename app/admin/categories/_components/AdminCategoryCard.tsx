import React from "react";
import {cn} from "@/lib/utils";
import { resolveIcon} from "@/components/custom-ui/resolve-icon";
import {colorClasses} from "@/lib/types";
import {Earth, MoreVerticalIcon, PencilIcon, Trash2Icon} from "lucide-react";
import {Card, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import Pill from "@/components/custom-ui/Pill";
import {Skeleton} from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";

export interface CategoryCardProps {
    icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    iconComponent?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconName?: string | null;
    iconLib?: string | null;
    //IconLib;
    iconSize?: number;
    title: string;
    id: string;
    desc: string;

    color?: string,
    //SemanticColor;
    /** ex: { from: "#FFA000", to: "#FF6F00" } — si tu veux garder l’option dégradé, sinon ignore */
    gradientOverride?: { from: string; to: string };

    count?: number;
    className?: string;
}

export default function AdminCategoryCard({
                                              icon,
                                              iconComponent,
                                              iconName,
                                              iconLib = "lucide",
                                              iconSize = 40,
                                              title,
                                              id,
                                              desc,
                                              color = "muted",
                                              count,
                                              className,
                                          }: CategoryCardProps) {
    const palette = colorClasses[color] ?? colorClasses.muted;


    // ---- Résolution unique de l'icône (composant) ----
    let IconComp: React.ComponentType<React.SVGProps<SVGSVGElement>> | null = null;
    let iconElementProps: React.SVGProps<SVGSVGElement> | undefined;
    const libSafe = (iconLib ?? "lucide") as string;

    if (icon && React.isValidElement<React.SVGProps<SVGSVGElement>>(icon)) {
        // On garde l’élément pour le foreground, mais on extrait le type pour le background
        IconComp = icon.type as React.ComponentType<React.SVGProps<SVGSVGElement>>;
        iconElementProps = icon.props;
    } else if (iconComponent) {
        IconComp = iconComponent;
    } else if (iconName) {
        IconComp = resolveIcon(iconName, libSafe);
    }

    // Fallback
    if (!IconComp) {
        IconComp = Earth;
    }


    return (
        <Card
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-2 transition hover:bg-white/10",
                "backdrop-blur-sm border-border",
                className
            )}
        >
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"secondary"} size={"icon"}>
                            <MoreVerticalIcon className={"size-4"}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={"end"} className={"w-48"}>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/categories/${id}/edit`}>
                                <PencilIcon className={"size-4 mr-2"}/>
                                Edit Category
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/categories/${id}/delete`}>
                                <Trash2Icon className={"size-4 mr-2 text-destructive"}/>
                                Delete Category
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {/* Icône BACKGROUND grand format (remplace le rond décoratif) */}
            <div
                className="pointer-events-none absolute -right-6 -top-6 "
                aria-hidden="true"
                style={{
                    // Tu peux garder un léger gradient derrière si souhaité
                    // background: bgGradient ?? undefined,
                    // Pour que le gradient ne déborde pas l'icône (si tu l'actives), on laisse transparent sinon
                }}
            >
                <IconComp width={180} height={180} className="text-foreground opacity-5"/>
            </div>

            {/* Contenu */}
            <Link className="relative" href="#catalog">
                <CardHeader className={"flex justify-between items-center gap-2 group"}>
                    <div className="">
                        <div className="mb-3 text-2xl">
                            {icon && React.isValidElement(icon)
                                ? React.cloneElement(icon, {
                                    width: iconSize,
                                    height: iconSize,
                                    className: cn(palette.text, iconElementProps?.className),
                                })
                                : (
                                    <IconComp
                                        width={iconSize}
                                        height={iconSize}
                                        className={palette.text}
                                    />
                                )}
                        </div>

                        <h4 className={cn("text-lg font-semibold", palette.text)}>{title}</h4>
                    </div>
                    <div className=" text-center space-y-2">
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{desc}</p>
                        {typeof count === "number" && (
                            <Pill>{count} formations</Pill>
                        )}
                    </div>

                </CardHeader>
            </Link>
        </Card>
    );
}


export function AdminCategoryCardSkeleton() {
    return (
        <Card className={"rounded-2xl border border-white/10 bg-white/5 px-2 "}>
            <div className="flex items-center justify-between gap-2">
                <div className="space-y-2 ">
                    <Skeleton className={"w-12 h-12 rounded-full bg-foreground/10"}/>
                    <Skeleton className={"w-16 h-6 rounded-lg bg-foreground/10"}/>
                </div>
                <div className="flex-1 space-y-2">
                    <Skeleton className={"w-full h-4 rounded-lg bg-foreground/10"}/>
                    <Skeleton className={"w-3/4 h-4 rounded-lg bg-foreground/10"}/>
                </div>
            </div>
        </Card>
    )
}
