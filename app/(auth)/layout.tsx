import Link from 'next/link';
import React from 'react';
import {ArrowLeft} from "lucide-react";
import { buttonVariants} from "@/components/ui/button";
import Image from "next/image";
import logo from "@/public/assets/logo.png";

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={"relative flex min-h-svh flex-col items-center justify-center"}>
            <Link href={"/"} className={buttonVariants({variant: "outline", className: "absolute top-4 left-4"})}>
                <ArrowLeft className={"size-4"}/> Back
            </Link>
            <div className="flex flex-col w-full gap-6 max-w-sm ">
                <Link href={"/"} className={"flex items-center gap-2 self-center font-medium"}>
                    <Image src={logo} alt={"Logo"} width={200} height={200}/>
                    {/*CodeAndSkills.*/}
                </Link>
                {children}
                <div className="text-balance text-center text-xs text-muted-foreground">
                    By clicking contunue, you agree to our
                    <Link href={"/"} className={"hover:text-primary hover:underline cursor-pointer"}>Terms of Service</Link> and
                    <Link href={"/"} className={"hover:text-primary hover:underline cursor-pointer"}>Privacy Policy</Link>"
                </div>
            </div>
        </div>
    );
};

