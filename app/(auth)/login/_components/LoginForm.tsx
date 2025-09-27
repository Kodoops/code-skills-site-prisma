"use client"

import React, {useState, useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Github, Loader, Loader2, Send} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {authClient} from "@/lib/providers/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const LoginForm = () => {

    const [githubPending, startGithubTransition] = useTransition();
    const [emailPending, startEmailTransition] = useTransition();

    const [email, setEmail] = useState('');
    const router = useRouter();

    async function signInWithGithub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Signed In With Github, you will be redirected ...");
                    },
                    onError: (error) => {
                        toast.error("Failed to Sign In With Github" + error.error.message);
                    },
                },
            })
        })
    }

    async function signInWithEmail() {
        startEmailTransition(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: "sign-in",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Verification OTP Sent to your Email, you will be redirected ...");
                        router.push(`/verify-request?email=${email}`);
                    },
                    onError: (error) => {
                        toast.error("Failed to Send Verification OTP" + error.error.message);
                    },
                },
            })
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle> Welcome Back! </CardTitle>
                <CardDescription>
                    Login With your Github or Email Account
                </CardDescription>
            </CardHeader>
            <CardContent className={"flex flex-col gap-4"}>
                <Button disabled={githubPending} onClick={signInWithGithub}
                        className={"w-full"} variant={"outline"}>

                    {githubPending ?( <>
                        <Loader className={"size-4 animate-spin"}/>
                        <span>Loading ...</span>
                    </>) : <>
                        <Github className={"size-4"}/>
                        Sign In With Github
                    </>
                    }
                </Button>
                <div className={"relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:h-px after:flex after:items-center after:justify-center after:border-t after:border-border"}>
                    <span className={"relative z-10 bg-card px-2 text-muted-foreground"}>Or Continue With </span>
                </div>

                <div className={"grid gap-3"}>
                    <div className={"grid gap-2"}>
                        <Label htmlFor={"email"}>Email</Label>
                    <Input value={email}
                           onChange={(e)=> setEmail(e.target.value)}
                           type={"email"}
                           placeholder={"email@exapmle.com"}
                            required
                    />
                    </div>
                    <Button onClick={signInWithEmail} disabled={emailPending}>
                        {emailPending? (
                            <>
                                <Loader2 className={"size-4 animate-spin"}/>
                                <span>Loading ...</span>
                            </>
                        )
                            :(<>
                              <Send  className={"size-4"}/>  Continue With Email
                            </>
                            )
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LoginForm;
