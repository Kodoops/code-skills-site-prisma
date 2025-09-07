"use client"

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {ThemeToggle} from "@/components/ui/themeToggle";
import {authClient} from "@/lib/auth-client";
import {buttonVariants} from "@/components/ui/button";
import UserDropdown from "@/app/(root)/_components/UserDropdown";

const navigationItems = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Courses",
        href: "/courses",
    },
    {
        name: "Dashboard",
        href: "/dashboard",
    }
]

const Navbar = () => {

    const {data: session, isPending} = authClient.useSession();

    return (
        <header
            className={"sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60"}>
            <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
                <Link href={"/"} className={"flex items-center space-x-2 mr-4"}>
                    <Image src={"/assets/logo.png"} alt={"Logo"} width={150} height={150}/>
                    <span>Code&Skills</span>
                </Link>
                {/*Desktop Nav*/}
                <nav className={"hidden md:flex md:flex-1 md:items-center md:justify-between"}>
                    <div className={"flex items-center space-x-2"}>
                        {navigationItems.map((item) => (
                            <Link href={item.href} key={item.name}
                                  className={"text-sm font-medium transition-colors hover:text-primary"}>
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className={"flex items-center space-x-4"}>
                        <ThemeToggle/>
                        {isPending ? null : session ? (
                                <UserDropdown name={session.user.name} email={session.user.email}
                                              image={session?.user.image ?? `http://avatar.vercel.sh/${session?.user.email}`} />
                            ) :
                            (
                                <>
                                    <Link href={"/login"}
                                          className={buttonVariants({variant: "secondary"})}>Login</Link>
                                    <Link href={"/signin"} className={buttonVariants()}>Get Started</Link>
                                </>
                            )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
