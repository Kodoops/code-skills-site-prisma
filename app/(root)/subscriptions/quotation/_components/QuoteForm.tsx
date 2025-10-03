"use client";

import React, {useTransition} from 'react';
import {Resolver, useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {
    ContactMessageSchema,
    contactQuotationSchema,
    ContactQuotationSchema
} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {createQuotationMessage} from "@/app/(root)/subscriptions/quotation/action";

const QuoteForm = () => {

    const [isPending, startTransition] = useTransition();

    const form = useForm<ContactQuotationSchema>({
        resolver: zodResolver(contactQuotationSchema) as Resolver<ContactQuotationSchema>,
        defaultValues: {
            email:  "",
            company:  "",
            message: "",
            employees: undefined,
        },
    });


    function onSubmit(values: ContactQuotationSchema) {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(createQuotationMessage(values));

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border rounded-lg p-12">

                <FormField
                    control={form.control}
                    name="company"

                    render={({field}) => (
                        <FormItem className="flex-1 w-full max-w-md ">
                            <FormLabel>Nom de l’entreprise</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex : TechCorp" {...field}
                                       className="h-12 rounded-lg placeholder:text-muted-foreground/30"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="employees"
                    render={({field}) => (
                    <FormItem  className="flex-1 w-full max-w-md ">
                        <FormLabel>Nombre de collaborateurs à former</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="Ex : 50"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                className="h-12 rounded-lg placeholder:text-muted-foreground/30"
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>


                )}/>

                <FormField
                    control={form.control}
                    name="email"

                    render={({field}) => (
                        <FormItem className="flex-1 w-full max-w-md ">
                            <FormLabel>Email professionnel</FormLabel>
                            <FormControl>
                                <Input placeholder="contact@entreprise.com" {...field}
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
                                <Textarea placeholder="Vos besoins spécifiques ..."
                                          className={"min-h-[160px]"}
                                          {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">Demander un devis</Button>
            </form>
        </Form>
    );
};

export default QuoteForm;
