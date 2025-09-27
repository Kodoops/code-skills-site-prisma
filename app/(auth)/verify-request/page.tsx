"use client"

import React, {Suspense, useState, useTransition} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/providers/auth-client";
import {redirect, useRouter, useSearchParams} from "next/navigation";
import {toast} from "sonner";
import {Loader2} from "lucide-react";

export default function VerifyRequestRoute(){

    return (
        <Suspense>
            <VerifyRequest />
        </Suspense>
    );
};

function  VerifyRequest (
//     {
//                            searchParams,
//                        }: {
//     searchParams: Record<string, string | string[] | undefined>;
// }
) {
    const router = useRouter();

    const [otp, setOtp] = useState('');
    const [emailPending, startTransition] = useTransition();
    const isOtpCompleted = otp.length === 6;

    const params = useSearchParams();
    const email = params.get("email");

    //const email = (searchParams.email as string) ?? "";

    function verifyOtp() {
        if (!email) {
            redirect("login");
        }

        startTransition(async () => {
            await authClient.signIn.emailOtp({
                email: email,
                otp: otp,
                fetchOptions: {
                    onSuccess: () => {
                        console.log("success");
                        toast.success("Email Vérified, you will be redirected ...");
                        router.push("/");
                    },
                    onError: (error) => {
                        console.log(error);
                        toast.error("Failed to Verify Email" + error.error.message);
                    },
                },
            })
        });
    }

    return (
        <Card className={"w-full mx-auto"}>
            <CardHeader className={"text-center"}>
                <CardTitle className={"text-xl"}>
                    Please check your Email
                </CardTitle>
                <CardDescription>
                    We have sent you a verification OTP, please check your email and enter the code to continue.
                </CardDescription>
            </CardHeader>
            <CardContent className={"flex flex-col gap-6"}>
                <div className="flex flex-col items-center space-y-2">
                    <InputOTP maxLength={6} className={"gap-2"} value={otp} onChange={(value) => setOtp(value)}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0}/>
                            <InputOTPSlot index={1}/>
                            <InputOTPSlot index={2}/>
                        </InputOTPGroup>
                        <InputOTPGroup>
                            <InputOTPSlot index={3}/>
                            <InputOTPSlot index={4}/>
                            <InputOTPSlot index={5}/>
                        </InputOTPGroup>
                    </InputOTP>
                    <p className={"text-muted-foreground text-sm"}>
                        Enter the code digit sent to your email
                    </p>
                </div>
                <Button className={"w-full"} disabled={emailPending || !isOtpCompleted} onClick={verifyOtp}>
                    {emailPending ? (
                        <>
                            <Loader2 className={"size-4 animate-spin"}/>
                            <span>Loading ...</span>
                        </>) : (
                        <>
                            Verfiy Account
                        </>)}
                </Button>
            </CardContent>
        </Card>
    );
};

