import React from 'react';
import Link from "next/link";
import Section from '@/components/sections/Section';
import AppLogoShape from "@/components/custom-ui/AppLogoShape";
import NavContent from "@/app/(root)/_components/NavContent";
import AppLogoText from "@/components/custom-ui/AppLogoText";

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
                            priority={ true}
                        />
                        <AppLogoText
                            logo="/logo/CODE_SKILLS_cropped.png"
                            alt="code and skills text"
                            width={250}
                            height={200}
                            priority
                        />
                    </div>
                    <nav className="flex-1 flex flex-wrap items-center justify-end gap-4 text-sm text-white/80 ">
                        <NavContent  btnStyles={"text-sm text-white/60 hover:text-primary "}/>
                    </nav>
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
    );
};

export default Footer;
