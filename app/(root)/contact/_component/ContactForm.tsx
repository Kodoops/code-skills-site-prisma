"use client";

import React, {useEffect, useTransition} from 'react';
import {authClient} from "@/lib/providers/auth-client";
import {Resolver, useForm} from "react-hook-form";
import {contactMessageSchema, ContactMessageSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';

import {Loader2, SendIcon} from "lucide-react";
import {createContactMessage} from "@/app/(root)/contact/action";

const ContactForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const {data: session} = authClient.useSession();

    const [isPending, startTransition] = useTransition();

    const form = useForm<ContactMessageSchema>({
        resolver: zodResolver(contactMessageSchema) as Resolver<ContactMessageSchema>,
        defaultValues: {
            email: session?.user?.email ?? "",
            name: session?.user?.name ?? "",
            subject: "",
            message: "",
            userId: session?.user?.id ?? "",
        },
    });

    function onSubmit(values: ContactMessageSchema) {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(createContactMessage(values));

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
                onSuccess?.(); // 👈 ferme le dialog
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

    useEffect(() => {
        if (session?.user) {
            form.reset({
                email: session.user.email ?? "",
                name: session.user.name ?? "",
                subject: "",
                message: "",
                userId: session.user.id ?? "",
            });
        }
    }, [session, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full  max-w-2xl gap-2 mx-auto space-y-6">
                <FormField
                    control={form.control}
                    name="name"

                    render={({field}) => (
                        <FormItem className="flex-1 w-full max-w-md ">
                            <FormLabel className="">Nom </FormLabel>
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
                        <FormItem className="flex-1 w-full max-w-md ">
                            <FormLabel >Email</FormLabel>
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
                    name="subject"
                    render={({ field }) => (
                        <FormItem className="w-full ">
                            <FormLabel>Sujet : </FormLabel>
                            <FormControl>
                                <Input placeholder="ex Demande de devis sur ... " {...field}
                                       className="h-12 rounded-lg placeholder:text-muted-foreground/30"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({field}) => (
                        <FormItem className={"w-full"}>
                            <FormLabel>Votre méssage</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Votre méssage"
                                          className={"min-h-[120px]"}
                                          {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type={"submit"} disabled={isPending}>
                    {isPending ? (<>
                        Sending Message ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                    </>) : (<>
                        Send Message <SendIcon className={"size-4 ml-1"}/>
                    </>)}
                </Button>
            </form>

        </Form>
    );
};

export default ContactForm;
