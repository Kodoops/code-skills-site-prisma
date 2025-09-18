"use client";

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Link, Loader2} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { SocialLinkType} from "@/lib/types";
import {useRouter} from "next/navigation";
import {type Resolver, useForm} from "react-hook-form";
import {CompanySocialLinkSchema, companySocialLinkSchema, SocialLinkSchema} from "@/lib/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import { addSocialLink } from '../actions';

const SocialLinkForm = ({links}:{links: SocialLinkType []}) => {

    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<CompanySocialLinkSchema>({
        resolver: zodResolver(companySocialLinkSchema) as Resolver<CompanySocialLinkSchema>,
        defaultValues: {
            url: "",
            socialLinkId:"",
        },
    })

    function onSubmit(values: CompanySocialLinkSchema) {
        startTransition(async () => {
            const {data:result , error} = await tryCatch(addSocialLink(values));

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
                router.push("/admin/social-links");
            }else{
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
        <Card>
            <CardHeader>
                <CardTitle>
                    Existing Social Links
                </CardTitle>
                <CardDescription>
                    Select social account to add to your website.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form} >
                    <form className={"space-y-6"}
                          onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="socialLinkId"
                                render={({field}) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Social </FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select social account" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {links.map((link) => (
                                                    <SelectItem key={link.id} value={link.id}>
                                                        {link.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="url"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Url</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Url to social account" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>


                        <Button type={"submit"} disabled={pending}>
                            {pending ? (<>
                                Adding  Account ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                            </> ) :(<>
                                <Link className={"size-4 ml-1"}/>  Attach Social Account
                            </>)}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default SocialLinkForm;
