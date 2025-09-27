"use client";

import React, {useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button, buttonVariants} from "@/components/ui/button";
import {ArrowLeft, Loader2, PlusIcon} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {iconLibs} from "@/lib/db/types";
import {useRouter} from "next/navigation";
import {type Resolver, useForm} from "react-hook-form";
import {socialLinkSchema, SocialLinkSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import { tryCatch } from '@/hooks/try-catch';
import { toast } from 'sonner';
import { createSocialNetwork } from './actions';
import Link from "next/link";
import {cn} from "@/lib/utils";

const CreateSocialNetwork = () => {

    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<SocialLinkSchema>({
        resolver: zodResolver(socialLinkSchema) as Resolver<SocialLinkSchema>,
        defaultValues: {
            name: "",
            iconName:"",
            iconLib: "",
        },
    })

    function onSubmit(values: SocialLinkSchema) {
        startTransition(async () => {
            const {data:result , error} = await tryCatch(createSocialNetwork(values));

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
                router.push("/admin/settings/social-networks");
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
                    Create Social Network
                </CardTitle>
                <CardDescription>
                    Provide basic information about social network.
                </CardDescription>
               <Link href={"/admin/settings/social-networks"} className={cn(buttonVariants({variant: "default"}), "w-48")}>
                   <ArrowLeft className={"size-4"}/> Back to Social Networks
               </Link>
            </CardHeader>
            <CardContent>
                <Form {...form} >
                    <form className={"space-y-6"}
                          onSubmit={form.handleSubmit(onSubmit)}
                    >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name ... ex facebook" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">

                                <FormField
                                    control={form.control}
                                    name="iconName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Icon Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name of icon" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="iconLib"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Icon library name</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select icon library name"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {iconLibs.map((lib) => (
                                                        <SelectItem key={lib} value={lib}>
                                                            {lib}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>


                        <Button type={"submit"} disabled={pending}>
                            {pending ? (<>
                                Creating Social Network ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                            </>) : (<>
                                <PlusIcon className={"size-4 ml-1"}/> Creating Social Network
                            </>)}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default CreateSocialNetwork;
