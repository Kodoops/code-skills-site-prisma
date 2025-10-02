"use client";

import React, {useEffect, useState, useTransition} from "react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Archive, Loader2, Reply, Trash2} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {ContactMessageType} from "@/lib/db/types";
import {tryCatch} from "@/hooks/try-catch";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {type Resolver, useForm} from "react-hook-form";
import {replyContactMessageSchema, ReplyContactMessageSchema} from "@/lib/db/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {replyToContactMessage} from "@/app/dashboard/messages/action";
import {authClient} from "@/lib/providers/auth-client";
import {formatDate} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {archiveContactMessage, deleteContactMessage} from "@/app/(root)/contact/action";
import {Badge} from "@/components/ui/badge";


const MessagesClient = ({messages, path}: { messages: ContactMessageType[], path: string }) => {

    const {data: session} = authClient.useSession();

    const [selected, setSelected] = useState<ContactMessageType | null>(null);

    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<ReplyContactMessageSchema>({
        resolver: zodResolver(replyContactMessageSchema) as Resolver<ReplyContactMessageSchema>,
        defaultValues: {
            response: "",
            adminId: session?.user.id,
            contactMessageId: selected?.id
        },
    })

    useEffect(() => {
        if (messages.length > 0 && !selected) {
            setSelected(messages[0]);
        }
    }, [messages, selected]);

    useEffect(() => {
        if (selected) {
            form.reset({
                response: "",
                adminId: session?.user.id,
                contactMessageId: selected.id,
            });
        }
    }, [selected, session?.user.id, form]);

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.stopPropagation();
        startTransition(async () => {
            const {data: result, error} = await tryCatch(deleteContactMessage(id));

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
                router.push(path);
            } else {
                toast.error(result?.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
        })
    };

    const handleArchive = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.stopPropagation();
        startTransition(async () => {
            const {data: result, error} = await tryCatch(archiveContactMessage(id));

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
                router.push(path);
            } else {
                toast.error(result?.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
        })
    };

    const onSubmit = (values: ReplyContactMessageSchema) => {
        if (!selected) return;

        startTransition(async () => {
            const {data: result, error} = await tryCatch(replyToContactMessage(values, path));

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
                setSelected(
                    messages.find((msg) => msg.id === values?.contactMessageId) ||
                    messages[0])
                router.push(path);
            } else {
                toast.error(result?.message, {
                    style: {
                        background: "#FEE2E2",
                        color: "#991B1B",
                    },
                });
            }
        })
    };

    return (
        <div className="flex flex-1 overflow-hidden max-h-[calc(100vh-14rem)]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border p-2 overflow-y-auto">
                {messages.length === 0 && <p className="text-muted-foreground">Aucun message</p>}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`relative w-full p-2 border-b cursor-pointer hover:bg-muted ${
                            selected?.id === msg.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelected(msg)}
                    >
                        <Button variant="outline" size="icon"
                                onClick={(e) => handleDelete(e, msg.id!)}
                                className="absolute top-2 right-2 z-10"
                        >
                            <Trash2 className="w-4 h-4 mr-1"/>
                        </Button>
                        <p className="font-semibold line-clamp-2">{msg.subject}</p>
                        <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDate(msg.createdAt)}</p>
                        <Badge
                            variant={`${msg.status === "open" ? "destructive" : msg.status === "answered" ? "default" : "outline"}`}>
                            {msg.status}
                        </Badge>
                    </div>
                ))}
            </aside>
            {/* Détails */}
            {selected ? (
                <div className="flex-1 flex flex-col max-h-[calc(100vh-14rem)] overflow-y-auto">
                    {/* Header */}
                    <div className="h-16 flex justify-between items-center border-b p-4">
                        <h3 className="font-bold text-lg">{selected.subject}</h3>
                        <div className="flex items-center gap-2">
                            {selected.status !=="closed" && <Button
                                variant="outline"
                                className={"cursor-pointer"}
                                size="sm"
                                onClick={(e) => handleArchive(e, selected.id)}
                            >
                                <Archive className="w-4 h-4 mr-1"/> Archiver
                            </Button> }
                            <Button
                                variant="destructive"
                                className={"cursor-pointer"}
                                size="sm"
                                onClick={(e) => handleDelete(e, selected.id)}
                            >
                                <Trash2 className="w-4 h-4 mr-1"/>
                            </Button>
                        </div>
                    </div>

                    {/* Contenu scrollable */}
                    <ScrollArea className="flex-1 p-4 overflow-y-auto">
                        <p>{selected.message}</p>

                        <div className="mt-4">
                            {selected.replies.length > 0 ? (
                                <div className="mt-2 p-2 border-t  ">
                                    <h4 className="font-semibold">Réponses :</h4>
                                    {selected.replies.map((reply) => (
                                        <div
                                            key={reply.id}
                                            className="text-sm text-muted-foreground border p-2 rounded-lg bg-muted-foreground/10 my-2"
                                        >
                                            <span className="text-xs">({formatDate(reply.createdAt)})</span>
                                            <p>{reply.response} </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-primary mt-2 text-center italic my-3">
                                    Aucune réponse pour l’instant
                                </p>
                            )}
                        </div>
                    </ScrollArea>

                    <Separator/>

                    {/* Formulaire fixé en bas */}
                    {selected.status !=="closed" && <div className="p-4 border-t h-48">
                        <Form {...form}>
                            <form
                                className="space-y-6"
                                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                                    console.log("Validation errors:", errors);
                                    toast.error("Veuillez corriger les erreurs du formulaire.");
                                })}
                            >
                                <FormField
                                    control={form.control}
                                    name="response"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Écrire une réponse..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <Button size="sm" type="submit" disabled={pending}>
                                    {pending ? (
                                        <>
                                            Sending ... <Loader2 className="size-4 animate-spin ml-1"/>
                                        </>
                                    ) : (
                                        <>
                                            <Reply className="w-4 h-4 mr-1"/> Répondre
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    Sélectionnez un message
                </div>
            )}
        </div>
    );
};

export default MessagesClient;
