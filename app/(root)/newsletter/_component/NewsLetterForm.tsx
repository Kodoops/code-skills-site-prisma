"use client";

import React, {useTransition} from 'react';
import {Resolver, useForm} from "react-hook-form";
import {newsletterSchema, NewsletterSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {tryCatch} from "@/hooks/try-catch";
import {subscribeToNewsletter} from "@/app/(root)/newsletter/action";
import {toast} from "sonner";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {theme} from "@/lib/theme";
import {useRouter} from "next/navigation";
import {authClient} from "@/lib/providers/auth-client";

const NewsLetterForm = () => {
    const { data: session } = authClient.useSession();

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<NewsletterSchema>({
        resolver: zodResolver(newsletterSchema) as Resolver<NewsletterSchema>,
        defaultValues: {email: session?.user.email, name: session?.user?.name, confirmed: false},
    });

    function onSubmit(values: NewsletterSchema) {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(subscribeToNewsletter(values));

            if (error) {
                toast.error(error.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
            if (result?.status === "success") {
                toast.success(result?.message, {
                    style: {
                        background: "#D1FAE5",
                        color: "#065F46",
                    },
                });

                form.reset();
                session?.user ? router.push('/dashboard/my-newsletter') : router.back();
            } else {
                toast.error(result?.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
        })
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full max-w-md gap-2 mx-auto space-y-6">

                <FormField
                    control={form.control}
                    name="name"

                    render={({field}) => (
                        <FormItem className="flex-1">
                            <FormLabel className="sr-only">Nom (optionnel)</FormLabel>
                            <FormControl>
                                <Input placeholder="ex : Jhon Doe " {...field}
                                       className="h-12 rounded-lg placeholder:text-muted-foreground/30"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"

                    render={({field}) => (
                        <FormItem className="flex-1">
                            <FormLabel className="sr-only">Email</FormLabel>
                            <FormControl>
                                <Input placeholder="ex contact@email.com... " {...field}
                                       className="h-12 rounded-lg placeholder:text-muted-foreground/30"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmed"
                    render={({ field }) => (
                        <FormItem className="flex items-start gap-2">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 ">
                                <FormLabel className="text-sm text-muted-foreground block spaxe-x-2">
                                    J’accepte que mon email soit utilisé pour m’envoyer la newsletter et j’ai lu la{" "}

                                    <Link
                                        href="/pages/privacy"
                                        className="text-primary underline-offset-4 hover:underline text-xs"
                                    >
                                        politique de confidentialité
                                    </Link>.
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending}
                        className="rounded-lg p-6 text-sm font-semibold text-white shadow transition hover:opacity-95"
                        style={{backgroundImage: theme.gradients.blue}}
                >
                    {isPending ? "..." : "S’abonner"}
                </Button>
            </form>
        </Form>
    );
};

export default NewsLetterForm;
