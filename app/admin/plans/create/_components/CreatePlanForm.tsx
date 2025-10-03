"use client"

import React, {useTransition} from 'react';
import {type Resolver, useForm} from "react-hook-form";
import {subscriptionPlanSchema, SubscriptionPlanSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {ArrowLeft, Loader2, PlusIcon, SparkleIcon} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import slugify from "slugify";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useRouter} from "next/navigation";
import {CURRENCY} from "@/lib/constants";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {createSubscriptionPlan} from "@/app/admin/plans/create/action";

const CreatePlanForm = () => {

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<SubscriptionPlanSchema>({
        resolver: zodResolver(subscriptionPlanSchema) as Resolver<SubscriptionPlanSchema>,
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            interval: "",
            price: undefined,
            active: true,
            currency: "",
            selected: false,
        },
    });

    function onSubmit(values: SubscriptionPlanSchema) {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(createSubscriptionPlan(values));

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
                router.push("/admin/plans");
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
        <>
            <div className="flex items-center gap-4">
                <Link href={"/admin/plans"} className={buttonVariants({variant: "outline", size: "icon"})}>
                    <ArrowLeft className={"size-4"}/>
                </Link>
                <h1 className={"text-2xl font-bol"}>Create Subscription Plan</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Basic Information
                    </CardTitle>
                    <CardDescription>
                        Provide basic information about subscription plan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form} >
                        <form className={"space-y-6"}
                              onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Title" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-4 items-end ">
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({field}) => (
                                        <FormItem className={"w-full"}>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Slug" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button type={"button"} className={"w-fit"}
                                        onClick={() => {
                                            const titleValue = form.getValues("title");
                                            const slug = slugify(titleValue);
                                            form.setValue('slug', slug, {shouldValidate: true});
                                        }}>
                                    Generate Slug <SparkleIcon className={"size-4 ml-1"}/>
                                </Button>
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem className={"w-full"}>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Small Description"
                                                      className={"min-h-[120px]"}
                                                      {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
                                <FormField
                                    control={form.control}
                                    name="interval"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Interval</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select interval"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem key={"monthly"} value={"monthly"}>
                                                        {"Monthly"}
                                                    </SelectItem>
                                                    <SelectItem key={"yearly"} value={"yearly"}>
                                                        {"Yearly"}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Prix"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="currency"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Currency</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select currency"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(CURRENCY).map(([key, value]) => (
                                                        <SelectItem key={key} value={key}>
                                                            {value}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 my-8">
                                <FormField
                                    control={form.control}
                                    name="active"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={(val) => field.onChange(Boolean(val))}
                                                />
                                            </FormControl>
                                            <FormLabel className="leading-none cursor-pointer select-none">
                                                Active
                                            </FormLabel>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="selected"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={(val) => field.onChange(Boolean(val))}
                                                />
                                            </FormControl>
                                            <FormLabel className="leading-none cursor-pointer select-none">
                                                Is Selected
                                            </FormLabel>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <Button type={"submit"} disabled={isPending}>
                                {isPending ? (<>
                                    Creating Plan ... <Loader2 className={"size-4 animate-spin ml-1"}/>
                                </>) : (<>
                                    Create Plan <PlusIcon className={"size-4 ml-1"}/>
                                </>)}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
};

export default CreatePlanForm;
