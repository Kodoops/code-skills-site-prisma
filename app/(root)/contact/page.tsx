import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import ContactForm from "@/app/(root)/contact/_component/ContactForm";

export default function ContactPage() {

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

                {/* Infos + Carte */}
                <div className="space-y-6">
                    <Card className={"max-w-2xl mx-auto space-y-4 px-6"}>
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
                </div>

                {/* Formulaire */}
                <Card className={"max-w-2xl mx-auto space-y-4 px-6"}>
                    <CardHeader>
                        <CardTitle className={"text-xl text-center "}>Envoyez-nous un message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ContactForm />
                    </CardContent>
                </Card>
            </div>
    );
}
