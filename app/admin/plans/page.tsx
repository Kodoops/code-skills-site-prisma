import React, {Suspense} from 'react';
import Link from "next/link";
import { buttonVariants} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import AdminPlanCard, { AdminCardPlanSkeleton } from "@/app/admin/plans/_components/AdminPlanCard";
import {adminGetSubscriptionPlans} from "@/app/data/admin/admin-get-subscriptions-plans";
import { PLANS_PER_PAGE} from "@/constants/admin-contants";


const PlansPage = async (props: {
    searchParams?: Promise<{
        page?: string | undefined;
    }>;
}) => {

    const params = await props.searchParams;
    const page = parseInt(params?.page ?? "1", 10);


    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className={"text-2xl font-bold"}>Our Subscription Plans</h1>
                <Link href={"/admin/plans/create"}
                      className={buttonVariants()}>
                    <PlusIcon className={"size-4"}/> Create Plan
                </Link>
            </div>
            <Suspense fallback={<RenderSkeletonPlanCardLayout />}>
                <RenderPlans current={page} nbrPage={PLANS_PER_PAGE} />
            </Suspense>
        </>

    )
        ;
};

export default PlansPage;


async function RenderPlans({current, nbrPage}:{current?: number | undefined, nbrPage: number}) {

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const {data:plans, totalPages, perPage, currentPage}  = await adminGetSubscriptionPlans(current , nbrPage);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans?.map((plan) => {
                return <AdminPlanCard key={plan.id} plan={plan}/>
            })}
            {/*<Card className="text-center">*/}
            {/*    <CardHeader className="border-b">*/}
            {/*        <CardTitle className={"text-2xl font-semibold mb-4"}>Mensuel</CardTitle>*/}
            {/*        <CardDescription>*/}
            {/*            Abonnement Mensuel, renouveller tous les mois, Facturation mensuelle. Annulez à tout moment.*/}
            {/*        </CardDescription>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent className="my-6  flex-1">*/}
            {/*        <div className="my-10 flex flex-col justify-center items-center  rounded-full bg-primary/60 p-4">*/}
            {/*            <div className="flex items-start justify-center">*/}
            {/*                <span className={"text-6xl font-bold"}>19</span>*/}
            {/*                <span className={"text-2xl font-bold"}>€</span>*/}
            {/*                <span className={"text-2xl"}>00</span>*/}
            {/*            </div>*/}
            {/*            <div className=" text-xs italic ">*/}
            {/*                par mois*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <ul className="list-disc list-inside text-left space-y-4 ml-10">*/}
            {/*            <li>Accès à tous les cours et ateliers</li>*/}
            {/*            <li>Prép. aux certifications</li>*/}
            {/*            <li>Recommandations basées sur les objectifs</li>*/}
            {/*            <li>Exercices optimisés</li>*/}
            {/*            <li>Validation des acquis a la fin des cours</li>*/}
            {/*            <li>Évaluations des compétences</li>*/}
            {/*            <li>Questions/Réponses formateur</li>*/}
            {/*            <li>Accès sur l&apos;application mobile</li>*/}
            {/*        </ul>*/}
            {/*    </CardContent>*/}
            {/*    <CardFooter className="border-t flex justify-center">*/}
            {/*        <Button className="btn btn-primary">*/}
            {/*            S&apos;inscrire*/}
            {/*        </Button>*/}
            {/*    </CardFooter>*/}
            {/*</Card>*/}
            {/*<Card className="text-center bg-primary/60 text-foreground">*/}
            {/*    <CardHeader className="border-b">*/}
            {/*        <CardTitle className={"text-2xl font-semibold  mb-4"}>Annuel</CardTitle>*/}
            {/*        <CardDescription className={""}>*/}
            {/*            Abonnement Annuel, renouveller tous les ans, Facturation annuelle. Annulez à tout moment.*/}
            {/*        </CardDescription>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent className="my-6  flex-1">*/}
            {/*        <div className="my-10 flex flex-col justify-center items-center  rounded-full bg-primary/60 p-4">*/}
            {/*            <div className="flex items-start justify-center">*/}
            {/*                <span className={"text-6xl font-bold"}>199</span>*/}
            {/*                <span className={"text-2xl font-bold"}>€</span>*/}
            {/*                <span className={"text-2xl"}>00</span>*/}
            {/*            </div>*/}
            {/*            <div className=" text-xs italic ">*/}
            {/*                par an*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <ul className="list-disc list-inside text-left space-y-4 ml-10">*/}
            {/*            <li>Accès à tous les cours et ateliers</li>*/}
            {/*            <li>Prép. aux certifications</li>*/}
            {/*            <li>Recommandations basées sur les objectifs</li>*/}
            {/*            <li>Exercices optimisés</li>*/}
            {/*            <li>Validation des acquis a la fin des cours</li>*/}
            {/*            <li>Évaluations des compétences</li>*/}
            {/*            <li>Questions/Réponses formateur</li>*/}
            {/*            <li>Accès sur l&apos;application mobile</li>*/}
            {/*        </ul>*/}
            {/*    </CardContent>*/}
            {/*    <CardFooter className="border-t flex justify-center">*/}
            {/*        <Button className="btn btn-primary">*/}
            {/*            S&apos;inscrire*/}
            {/*        </Button>*/}
            {/*    </CardFooter>*/}
            {/*</Card>*/}
            {/*<Card className="text-center">*/}
            {/*    <CardHeader className="border-b">*/}
            {/*        <CardTitle className={"text-2xl font-semibold mb-4"}>Entreprise</CardTitle>*/}
            {/*        <CardDescription>*/}
            {/*            Abonnement selon les situations, Facturation mensuelle / annuelle.*/}
            {/*        </CardDescription>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent className="my-6 flex-1">*/}
            {/*        <div className="my-10 flex flex-col justify-center items-center  rounded-full bg-primary/60 p-4">*/}
            {/*            <div className="flex items-start justify-center">*/}
            {/*                <span className={"text-2xl font-bold"}>Prix a définir</span>*/}
            {/*            </div>*/}
            {/*            <div className=" text-xs italic ">*/}
            {/*                par an / mois selon devis*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <ul className="list-disc list-inside text-center">*/}
            {/*            <li>Accès à plus de 27 500 des meilleurs cours</li>*/}
            {/*            <li> Prép. aux certifications</li>*/}
            {/*            <li> Recommandations basées sur les objectifs</li>*/}
            {/*            <li>Exercices de codage optimisés par l&apos;IA</li>*/}
            {/*            <li>Rapports d&apos;analytique et d&apos;adoption</li>*/}

            {/*            <li>Parcours préconçus</li>*/}
            {/*            <li>Parcours d'apprentissage, cours et groupes d&aops;utilisateurs personnalisés</li>*/}
            {/*            <li>Support client</li>*/}
            {/*        </ul>*/}
            {/*    </CardContent>*/}
            {/*    <CardFooter className="border-t flex justify-center">*/}
            {/*        <Button className="btn btn-primary">*/}
            {/*            Demander un devis*/}
            {/*        </Button>*/}
            {/*    </CardFooter>*/}
            {/*</Card>*/}
        </div>
    )
}

function RenderSkeletonPlanCardLayout() {

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({length: 3}).map((_, index) => (
            <AdminCardPlanSkeleton key={index} />
            ))}
        </div>
    )
}
