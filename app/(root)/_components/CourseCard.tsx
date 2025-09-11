// // TO DELETE
//
// "use client ";
//
//
// import {Skeleton} from "@/components/ui/skeleton";
//
// import React from "react";
// import Image from "next/image";
// import {buttonVariants} from "@/components/ui/button";
// import Link from "next/link";
// import {CategoryItem, levelBgColors} from "@/lib/types";
// import {Badge} from "@/components/ui/badge";
// import {Card, CardContent} from "@/components/ui/card";
// import {SchoolIcon, TimerIcon} from "lucide-react";
// import {cn} from "@/lib/utils";
// import {useConstructUrl} from "@/hooks/use-construct-url";
// import {IconCash} from "@tabler/icons-react";
//
// export default function CourseCard({
//                                        title,
//                                        level,
//                                        slug,
//                                        smallDescription,
//                                        duration,
//                                        filekey,
//                                        price,
//                                        category,
//
//                                    }: {
//     title: string;
//     level: string;
//     duration: number;
//     slug: string;
//     smallDescription: string;
//     filekey: string;
//     price?: number;
//     category: CategoryItem;
// }) {
//
//     const thumbnailURl = useConstructUrl(filekey);
//     console.log(
//         "thumbnailURl",
//         thumbnailURl)
//     return (
//
//         <Card className={"group relative py-0 gap-0"}>
//             <Badge
//                 className={cn(
//                     "absolute top-2 right-2 text-foreground z-10",
//                     levelBgColors[level] ?? "bg-accent" // fallback si non trouvé
//                 )}
//             >
//                 {level}
//             </Badge>
//             <Image src={thumbnailURl} alt={title} width={600} height={400}
//                    className={"w-full rounded-t-xl aspect-video h-full object-cover"}/>
//             <CardContent className={"p-4"}>
//                 <Link href={`/courses/${slug}`}
//                       className={"text-lg font-medium line-clamp-2 hover:underline group-hover:text-primary transition-colors"}>
//                     {title}
//                 </Link>
//                 <p className={"line-clamp-2 text-sm text-muted-foreground leading-tight mt-2"}>
//                     {smallDescription}
//                 </p>
//                 <div className="flex items-center justify-between gap-x-5 mt-4">
//                     <div className=" flex items-center gap-x-5">
//                         <div className="flex items-center gap-x-2">
//                             <TimerIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
//                             <p className={"text-sm text-muted-foreground"}>{duration}h</p>
//                         </div>
//                         <div className="flex items-center gap-x-2">
//                             <SchoolIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
//                             <p className={"text-sm text-muted-foreground"}>{category.title}</p>
//                         </div>
//                     </div>
//
//                     <div className="flex items-center gap-x-2">
//                         <IconCash className={`size-6 p-1 rounded-md ${price===0 ? "text-green-600":"text-primary"} bg-primary/10`}/>
//                         <p className={`text-sm font-semibold ${price===0 ? "text-green-600":"text-primary"}`}>{price !== 0 ? (price! / 100).toFixed(2) + " €" : "Gratuit"}</p>
//                     </div>
//                 </div>
//
//                 <Link href={`/courses/${slug}`} className={buttonVariants({className: "w-full mt-4"})}>Learn More</Link>
//
//             </CardContent>
//         </Card>
//     );
// }
//
//
// export function CourseCardSkeleton() {
//     return <Card className={"group relative py-0 gap-0"}>
//         <div className={"absolute top-2 right-2 z-10 flex items-center gap-2"}>
//             <Skeleton className={"h-6 w-20 rounded-full bg-muted-foreground/10"}/>
//         </div>
//         <div className={" w-full relative h-fit"}>
//             <Skeleton className={"w-full rounded-t-lg aspect-video h-[250px] object-cover bg-muted-foreground/10 "}/>
//         </div>
//         <CardContent className={"p-4"}>
//             <div className="space-y-2">
//                 <Skeleton className={"h-6 w-full bg-muted-foreground/10 "}/>
//                 <Skeleton className={"w-3/4 h-6 bg-muted-foreground/10 "}/>
//             </div>
//
//             <div className="mt-4 flex items-center gap-x-5">
//                 <div className="flex items-center gap-x-2 ">
//                     <Skeleton className={"size-6 rounded-md bg-muted-foreground/10"}/>
//                     <Skeleton className={"h-4 w-8 bg-muted-foreground/10"}/>
//                 </div>
//                 <div className="flex items-center gap-x-2">
//                     <Skeleton className={"size-6 rounded-md bg-muted-foreground/10"}/>
//                     <Skeleton className={"h-4 w-8 bg-muted-foreground/10"}/>
//                 </div>
//             </div>
//             <Skeleton className={buttonVariants({className: "mt-4 h-10 w-full rounded bg-muted-foreground/10"})}/>
//         </CardContent>
//     </Card>
// }
