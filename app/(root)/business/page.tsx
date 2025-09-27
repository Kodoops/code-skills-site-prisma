"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, BarChart3, GraduationCap } from "lucide-react";

export default function BusinessLandingPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary to-indigo-600 text-white py-24 px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    Faites monter en compétences vos équipes
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                    Des parcours personnalisés, des workshops pratiques et un suivi clair
                    pour développer vos talents plus vite et plus efficacement.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button size="lg" variant="secondary">
                        Demander une démo
                    </Button>
                    <Button size="lg" variant="outline" className="bg-white text-primary">
                        Parler à un conseiller
                    </Button>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Pourquoi choisir notre plateforme ?
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <Users className="w-10 h-10 text-primary mb-2" />
                            <CardTitle>Parcours personnalisés</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Construisez des Learning Paths adaptés aux besoins et objectifs de
                            votre entreprise.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <GraduationCap className="w-10 h-10 text-primary mb-2" />
                            <CardTitle>Workshops interactifs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Apprentissage en situation réelle grâce à des ateliers pratiques
                            animés par des experts.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <BarChart3 className="w-10 h-10 text-primary mb-2" />
                            <CardTitle>Suivi et reporting</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Suivez la progression de vos collaborateurs et mesurez l’impact de
                            vos formations.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CheckCircle className="w-10 h-10 text-primary mb-2" />
                            <CardTitle>Certifications valorisantes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Offrez à vos équipes la reconnaissance de leurs nouvelles
                            compétences avec des certificats.
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA Final */}
            <section className="bg-primary text-white py-20 px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Passez vos équipes au niveau supérieur 🚀
                </h2>
                <p className="mb-8 text-lg">
                    Boostez la productivité et attirez les meilleurs talents grâce à des
                    formations adaptées.
                </p>
                <Button size="lg" variant="secondary">
                    Commencer maintenant
                </Button>
            </section>
        </div>
    );
}
