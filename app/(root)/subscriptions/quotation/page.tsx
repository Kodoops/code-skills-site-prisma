import QuoteForm from "./_components/QuoteForm";

export default function BusinessQuotationPage() {


    return (
        <div className="max-w-3xl  p-6 container mx-auto px-6 py-12 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-4xl font-bold">Demande de devis</h1>
                <div className="">
                    <p className="text-muted-foreground">
                        Remplissez le formulaire ci-dessous avec les informations demandées afin de mieux estimer votre
                        besoin.
                    </p>
                    <p className="text-muted-foreground">
                        Nous reviendrons vers vous avec une offre commerciales dans les plus brefs délais.
                    </p>
                </div>
            </div>
            <QuoteForm />
        </div>
    );
}
