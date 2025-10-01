import React from 'react';
import {getNewsletterSubscription} from "@/app/data/newsletter/get-newsletter-subscription";
import {requireUser} from "@/app/data/user/require-user";
import NewsLetterForm from "@/app/(root)/newsletter/_component/NewsLetterForm";
import {Card} from "@/components/ui/card";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import { cn } from '@/lib/utils';

const MyNewsLetterPage = async () => {

    const user = await requireUser();

    const newsletter = await getNewsletterSubscription(user.email);

    if(!newsletter) return (
        <div>
           <div className="flex items-center justify-center h-24">
              <p className={"text-center text-muted-foreground text-lg"}>
                  You are not subscribed to our newsletter.
              </p>
           </div>

           <Card className="m-6">
               <h2 className={"text-xl text-center my-6"}>Inscription à la Newsletter </h2>
               <NewsLetterForm  />
           </Card>
        </div>
    )

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="flex items-center justify-center p-6">
                <div className="">
                    <p className={"text-center text-muted-foreground text-lg"}>
                        You are subscribed to our newsletter.
                    </p>
                    <p className={"text-center text-muted-foreground text-lg"}>
                        You will receive an email every time we publish a new article.
                    </p>
                       <div className=" flex items-center justify-center mt-6 ">
                           <Link href={"/dashboard/my-newsletter/unsubscribe?email=" + user.email}
                                 className={cn(buttonVariants())}>
                               Unsubscribe
                           </Link>
                       </div>
                </div>
            </div>

        </div>
    );
};

export default MyNewsLetterPage;
