"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle2, Mail, Shield } from "lucide-react";

export default function NewsletterSignupPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    // honeypot anti-bot
    const [company, setCompany] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // simple validations (coté client)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Merci d’entrer un email valide.");
            return;
        }
        if (!agree) {
            setError("Veuillez accepter la politique de confidentialité.");
            return;
        }
        if (company.trim().length > 0) {
            setError("Vérification anti‑bot échouée.");
            return;
        }

        setLoading(true);
        try {
            // 👉 remplace par un vrai appel (action, API route, etc.)
            await new Promise((r) => setTimeout(r, 900));
            setSuccess("Merci ! Vous êtes bien inscrit·e à la newsletter.");
            setEmail("");
            setName("");
            setAgree(false);
        } catch (e) {
            setError("Une erreur est survenue. Réessayez.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-[80dvh] w-full grid place-items-center px-4">
            <section className="max-w-4xl w-full">
                <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-medium rounded-full border px-3 py-1 bg-muted">
            <Mail className="size-4" /> Newsletter
          </span>
                    <h1 className="text-3xl md:text-4xl font-bold mt-4">
                        Restez au courant des nouveautés
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Cours, workshops, bons plans et actus produits. 1 à 2 emails / mois, pas de spam.
                    </p>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Inscription</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-5">
                            {/* Nom (optionnel) */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom (optionnel)</Label>
                                <Input
                                    id="name"
                                    placeholder="Ex: Samira"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                />
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="vous@exemple.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            {/* honeypot caché */}
                            <div className="hidden">
                                <Label htmlFor="company">Société (ne pas remplir)</Label>
                                <Input
                                    id="company"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            {/* Consentement */}
                            <div className="flex items-start gap-3">
                                <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
                                <Label htmlFor="agree" className="text-sm leading-tight text-muted-foreground">
                                    J’accepte que mon email soit utilisé pour m’envoyer la newsletter et j’ai lu la
                                    {" "}
                                    <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
                                        politique de confidentialité
                                    </a>
                                    .
                                </Label>
                            </div>

                            {/* Messages d’état */}
                            {error && (
                                <div className="flex items-center gap-2 text-destructive text-sm" role="alert">
                                    <AlertCircle className="size-4" />
                                    <span>{error}</span>
                                </div>
                            )}
                            {success && (
                                <div className="flex items-center gap-2 text-green-600 text-sm" role="status">
                                    <CheckCircle2 className="size-4" />
                                    <span>{success}</span>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                                <Button type="submit" disabled={loading} className="h-11">
                                    {loading ? "Inscription…" : "Je m’inscris"}
                                </Button>
                                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Shield className="size-4" />
                                    Désinscription en 1 clic, aucune revente de données.
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}
