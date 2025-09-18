"use client";

import React from "react";
import { MiniCard } from "@/app/(root)/learning-paths/_components/MiniCard";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CarouselGrid from "@/app/(root)/_components/CarouselGrid";
import {SchoolIcon, TimerIcon} from "lucide-react";
import ProductPrice from "@/components/custom-ui/ProductPrice";

const courses = [
    { id: "c1", title: "HTML & CSS", description: "Apprenez à créer des pages web modernes." },
    { id: "c2", title: "JavaScript", description: "Maîtrisez le langage du web dynamique." },
    { id: "c3", title: "Frameworks", description: "Maîtrisez les frameworks du web." },
];

const workshops = [
    { id: "w1", title: "Projet Portfolio", description: "Créez votre portfolio professionnel." },
    { id: "w2", title: "Projet Todo list", description: "Créez votre TODO List." },
    { id: "w3", title: "Projet App", description: "Créez votre application professionnelle." },
];

const resources = [
    "Guide PDF complet",
    "Modèle Figma UI",
    "Vidéo bonus : Conseils de carrière",
];

export default function LearningPathCard({
                                             data,
                                             isEnrolled,
                                         }: {
    data: any;
    isEnrolled: boolean;
}) {
    return (
        <Card className="max-w-4xl mx-auto p-6 space-y-6 rounded-xl border shadow-md">
            <Image
                src="/images/devops.png"
                alt="Image du parcours"
                className="max-w-full max-h-64 object-cover rounded-lg aspect-video"
                width={800}
                height={800}
            />
            <CardHeader>
                <CardTitle>
                    <h2 className="text-2xl font-bold">Parcours : Développeur Frontend</h2>
                </CardTitle>
                <CardDescription>
                    <p className="text-muted-foreground">
                        Un parcours complet pour maîtriser les bases du développement web moderne avec HTML,
                        CSS, JavaScript et projets concrets.
                    </p>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-x-5 ">
                            <div className="flex items-center gap-x-2">
                                <TimerIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
                                <p className={"text-sm text-muted-foreground"}>{20}h</p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <SchoolIcon className={"size-6 p-1 rounded-md text-primary bg-primary/10"}/>
                                <p className={"text-sm text-muted-foreground"}>FrontEnd</p>
                            </div>
                        </div>

                        <ProductPrice finalPrice={200} price={data.price!}/>
                    </div>
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
                {/* 🔁 Carousel des cours */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Cours inclus</h3>
                    <CarouselGrid
                        items={courses}
                        perPage={2} // 2 par slide avec grid 2 colonnes
                        grid={{baseCols: 1, smCols: 2, lgCols: 2}}
                        renderItem={(course) => <MiniCard {...course} />}
                        itemKey={(course) => course.id}
                        autoplayMs={0}
                    />
                </div>

                {/* 🔁 Carousel des workshops */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Workshops</h3>
                    <CarouselGrid
                        items={workshops}
                        perPage={2} // 2 par slide
                        grid={{ baseCols: 1, smCols: 2, lgCols: 2 }}
                        renderItem={(workshop) => <MiniCard {...workshop} />}
                        itemKey={(workshop) => workshop.id}
                        autoplayMs={0}
                    />
                </div>

                {/* ✅ Liste simple des ressources */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Ressources complémentaires</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {resources.map((res, i) => (
                            <li key={i}>{res}</li>
                        ))}
                    </ul>
                </div>
            </CardContent>

            <CardFooter>
                <Button className="w-full">
                    {isEnrolled ? "Accéder au parcours" : "S'inscrire à ce parcours"}
                </Button>
            </CardFooter>
        </Card>
    );
}
