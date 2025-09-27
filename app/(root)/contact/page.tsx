"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

// ✅ Validation avec Zod
const contactSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    subject: z.string().min(3, "Sujet trop court"),
    message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);

        // 👉 À remplacer par ton API d’envoi (ex: email, backend, etc.)
        console.log("Message envoyé :", data);

        setTimeout(() => {
            reset();
            setIsSubmitting(false);
            alert("Votre message a bien été envoyé ✅");
        }, 1000);
    };

    return (
        <div className="container mx-auto px-6 py-12 space-y-12">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-4xl font-bold">Contactez-nous</h1>
                <p className="text-muted-foreground">
                    Une question ? Un projet ? Remplissez le formulaire ci-dessous ou
                    contactez-nous directement.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Formulaire */}
                <Card>
                    <CardHeader>
                        <CardTitle>Envoyez-nous un message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Input
                                    placeholder="Votre nom"
                                    {...register("name")}
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    type="email"
                                    placeholder="Votre email"
                                    {...register("email")}
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    placeholder="Sujet"
                                    {...register("subject")}
                                    className={errors.subject ? "border-red-500" : ""}
                                />
                                {errors.subject && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.subject.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Textarea
                                    placeholder="Votre message"
                                    rows={5}
                                    {...register("message")}
                                    className={errors.message ? "border-red-500" : ""}
                                />
                                {errors.message && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.message.message}
                                    </p>
                                )}
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Infos + Carte */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nos coordonnées</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="flex items-center gap-2">
                                <MapPin className="text-primary w-5 h-5" />
                                Alger, Algérie
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail className="text-primary w-5 h-5" />
                                contact@monentreprise.com
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone className="text-primary w-5 h-5" />
                                +213 555 123 456
                            </p>
                        </CardContent>
                    </Card>

                    {/* Carte Google Maps */}
                    <div className="overflow-hidden rounded-lg shadow-md h-[300px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.994144969868!2d3.058756215595739!3d36.75376837995427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128e52d7f93f7d11%3A0x35c9e0d3f98e47cc!2sAlger!5e0!3m2!1sfr!2sdz!4v1670000000000!5m2!1sfr!2sdz"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}
