import React from 'react';
import Link from "next/link";
import Section from '@/components/sections/Section';
import AppLogoShape from "@/components/custom-ui/AppLogoShape";
import NavContent from "@/app/(root)/_components/NavContent";
import AppLogoText from "@/components/custom-ui/AppLogoText";
import {Facebook, Github, Instagram, Linkedin, Youtube} from "lucide-react";
import {SiFacebook, SiGithub, SiInstagram, SiX, SiYoutube} from "react-icons/si";

const Footer = () => {
    return (
        <footer className="border-t border-white/10 py-10">
            <Section>
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <div className="text-center justify-center">
                        <AppLogoShape
                            logo="/logo/code&skills-transparent.png"
                            width={200}
                            height={200}
                            priority={true}
                        />
                        <AppLogoText
                            logo="/logo/CODE_SKILLS_cropped.png"
                            alt="code and skills text"
                            width={250}
                            height={200}
                            priority
                        />
                    </div>
                    <div className="flex flex-col md:flex-row flex-1 items-center justify-between gap-6">
                        <div className="flex-1 w-full">
                            <h2 className={"text-lg mb-4 font-semibold"}>Liens utils</h2>
                            <nav
                                className=" w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 text-sm text-white/80 ">
                                <NavContent btnStyles={"text-sm text-white/60 hover:text-primary "}/>
                            </nav>
                        </div>
                        <div className="flex-1">
                            <h2 className={"text-lg  text-right mb-4 font-semibold"}>Restez connecté avec
                                nous !</h2>
                            <div className="flex gap-6 justify-end items-center cursor-pointer "   >
                                <Link href="https://www.facebook.com/codeskills.fr" target="_blank">
                                    <SiFacebook className={"size-6 text-muted-foreground hover:text-primary"}/>
                                </Link>
                                <Link href="https://www.twitter.com/codeskills.fr" target="_blank">
                                    <SiX className={"size-6 text-muted-foreground hover:text-primary"}/>
                                </Link>
                                <Link href="https://www.instagram.com/codeskills.fr/" target="_blank">
                                    <SiInstagram className={"size-6 text-muted-foreground hover:text-primary"}/>
                                </Link>
                                <Link href={"https://www.youtube.com/codeskills"}>

                                    <SiYoutube className={"size-6 text-muted-foreground hover:text-primary"}/>
                                </Link>
                                <Link href={"https://www.github.com/codeskills/"}>

                                    <SiGithub className={"size-6 text-muted-foreground hover:text-primary"}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
            <Section className="py-6  ">
                <nav className="flex  flex-wrap items-center justify-center gap-4 text-xs text-white/60">
                    <p className="mt-1 text-xs text-white/60">© {new Date().getFullYear()} Code&Skills — Tous droits
                        réservés.</p>
                    <Link href="/" className="hover:text-white">CGU / CGC</Link>
                    <Link href="/" className="hover:text-white">Mentions - légales</Link>
                    <Link href="/" className="hover:text-white">Confidentialité</Link>
                </nav>
            </Section>
        </footer>
    )
        ;
};

export default Footer;
