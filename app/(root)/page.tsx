import {Button} from "@/components/ui/button";
import Link from "next/link";
import SectionTitle from "@/components/sections/SectionTitle";
import Section from "@/components/sections/Section";
import React, {Suspense} from "react";
import FeaturedCarouselClient from "@/components/sections/FeaturedCarousel.client";
import { TestimonialType} from "@/lib/types";
import SectionHeader from "@/components/sections/SectionHeader";
import CategoriesCarouselClient from "@/components/sections/CategoriesCarousel.client";
import CoursesCarouselClient from "@/components/sections/CoursesCarousel.client";
import TestimonialCarouselClient from "@/components/sections/TestimonialCarousel.client";
import BannerPartner from "@/components/sections/BannerPartner";
import NewsLetterForm from "@/components/sections/NewsLetterForm";
import {getFeaturedCourses} from "@/app/data/courses/get-featured-courses";
import {getAllCategories} from "@/app/data/categories/get-all-categories";
import {CategoryCardSkeleton} from "@/app/(root)/_components/CategoryCard";
import AppHero from "@/app/(root)/_components/AppHero";
import AppLogoText from "@/components/custom-ui/AppLogoText";
import {getAllFeatures} from "@/app/data/features/get-all-features";
import {FeatureCardSkeleton} from "@/app/(root)/_components/FeatureCard";
import {PublicCourseCardSkeleton} from "@/app/(root)/_components/PublicCourseCard";
import {getAllEnrolledCoursesByUser} from "@/app/data/user/get-enrolled-courses";

const TESTIMONIALS: TestimonialType[] = [
    {
        name: "Nadia K.", role: "Développeuse frontend", rating: 5,
        text: "Les parcours sont super bien structurés, j’ai pu passer de débutante à opérationnelle rapidement !"
    },
    {
        name: "Yacine B.", role: "Ingénieur DevOps", rating: 4,
        text: "Les exercices pratiques et la CI/CD m’ont permis d’automatiser mes projets perso concrètement."
    },
    {
        name: "Sofia M.", role: "Étudiante", rating: 5,
        text: "Les explications sont claires et motivantes. J’adore le suivi de progression et les badges."
    },
    {
        name: "Yacine B.", role: "Ingénieur DevOps", rating: 4,
        text: "Les exercices pratiques et la CI/CD m’ont permis d’automatiser mes projets perso concrètement."
    },
    {
        name: "Sofia M.", role: "Étudiante", rating: 5,
        text: "Les explications sont claires et motivantes. J’adore le suivi de progression et les badges."
    }
];


export default async function Home() {

    return (
        <>
            <AppHero/>

            {/* CATEGORIES*/}
            <Section className="py-12">
                <SectionHeader
                    title={"Catégories populaires"}
                    //btnList={["Débutant", "Avec projets", "Certifiantes"]}
                    btnListHref={"/categories"}
                    btnLink={"/categories"}
                />
                <Suspense fallback={<CategoriesLoadingSkeletonLayout/>}>
                    <RenderCategories/>
                </Suspense>
            </Section>

            {/* CATALOG */}
            <Section className="py-12">
                <SectionHeader
                    title={"Formations mises en avant"}
                    btnList={[ "Débutant", "Intermédiaire", "Avancé", "Expert"]}
                    btnListHref={"/courses"}
                    btnLink={"/courses"}
                />
                <Suspense fallback={<FeaturedCoursesLoadingSkeletonLayout/>}>
                    <RenderCourses/>
                </Suspense>
            </Section>

            {/* FEATURES */}
            <Section className="py-12">
                <SectionTitle
                    title="Pourquoi "
                    subTitle={"Une plateforme pensée pour apprendre vite, bien et durablement."}
                >
                    <AppLogoText
                        logo="/logo/CODE_SKILLS_cropped.png"
                        alt="code and skills text"
                        width={250}
                        height={200}
                    />
                </SectionTitle>

                <Suspense fallback={<FeaturesLoadingSkeletonLayout/>}>
                    <RenderFeatures/>
                </Suspense>
            </Section>

            {/* TESTIMONIALS id="testimonials"*/}
            <Section className="py-12">
                <SectionTitle
                    title="Ils apprennent avec Code&Skills"
                    subTitle={"Des retours concrets d’apprenants et de pros."}
                >
                </SectionTitle>
                <TestimonialCarouselClient items={TESTIMONIALS}/>
            </Section>

            {/* PARTNERS / PROMO */}
            <Section className="py-12">
                <BannerPartner title={"-30% sur l’abonnement annuel"}
                               subTitle={"Offre de lancement limitée. Accès illimité aux parcours et nouvelles formations."}
                               buttons={<>

                                   <Button asChild variant={"secondary"}
                                           className="rounded-xl bg-black/20 p-6 text-sm font-semibold backdrop-blur transition hover:bg-black/30">
                                       <Link href={"/signup"}>S’abonner</Link>
                                   </Button>
                                   <Button
                                       asChild
                                       className="rounded-xl text-white bg-white/20 p-6 text-sm font-semibold backdrop-blur transition hover:bg-white/30">
                                       <Link href={"/catalogue"}>Voir le catalogue</Link>
                                   </Button>
                               </>}
                >
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {["AWS", "Stripe", "GitHub", "Docker", "Vercel", "PostgreSQL"].map((p) => (
                            <div key={p}
                                 className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white/80">{p}</div>
                        ))}
                    </div>
                </BannerPartner>
            </Section>

            {/* NEWSLETTER id="newsletter"*/}
            <Section className="py-14">
                <div className="mx-auto max-w-2xl text-center">
                    <SectionTitle
                        title="Reste informé des nouvelles formations"
                        subTitle={"Pas de spam, juste le meilleur du code et de la tech."}
                        titleStyle={"text-xl"}
                    >
                    </SectionTitle>
                    <NewsLetterForm/>
                </div>
            </Section>
        </>
    );
}


async function RenderCourses() {

    const data = await getFeaturedCourses();

    const enrolledByUser  = await getAllEnrolledCoursesByUser();

    const enrolledCourseIds = enrolledByUser.map(enrollment => enrollment.course.id);

    const alreadyEnrolled: string[] = [];

    const cleaned = data.map(course => {
        const isEnrolled = enrolledCourseIds.includes(course.id);
        if (isEnrolled) {
            alreadyEnrolled.push(course.id);
        }

        return ({
            ...course,
        })
    });

    return (
        <CoursesCarouselClient items={cleaned} perPage={6} alreadyEnrolled = {alreadyEnrolled}/>
    );
}


function FeaturedCoursesLoadingSkeletonLayout() {

    return (
        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
            {Array.from({length: 6}).map((_, index) => (
                <PublicCourseCardSkeleton key={index}/>
            ))}
        </div>
    )
}


async function RenderCategories() {
    const data = await getAllCategories()

    return (
        <CategoriesCarouselClient items={data} perPage={4}/>
    )
}

function CategoriesLoadingSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({length: 4}).map((_, index) => (
                <CategoryCardSkeleton key={index}/>
            ))}
        </div>
    )
}


async function RenderFeatures() {
    const {data, totalPages, perPage, page, total} = await getAllFeatures(1, 9)

    return (
        <FeaturedCarouselClient items={data} perPage={3}/>
    )
}

function FeaturesLoadingSkeletonLayout() {
    return (
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length: 3}).map((_, index) => (
                <FeatureCardSkeleton key={index}/>
            ))}
        </div>
    )
}
