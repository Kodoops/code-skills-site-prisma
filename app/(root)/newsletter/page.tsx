
import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import { Mail} from "lucide-react";

import NewsLetterForm from "./_component/NewsLetterForm";

export default function NewsletterSignupPage() {


    return (
        <main className="min-h-[80dvh] w-full grid place-items-center px-4">
            <section className="max-w-4xl w-full">
                <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-medium rounded-full border px-3 py-1 bg-muted">
            <Mail className="size-4"/> Newsletter
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
                        <CardTitle className={"text-center"}>Inscription</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                       <NewsLetterForm />
                    </CardContent>
                </Card>
            </section>
        </main>
);
}
