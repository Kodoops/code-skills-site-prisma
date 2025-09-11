import React from 'react';
import {theme} from "@/lib/theme";
import {Button} from "@/components/ui/button";

const NewsLetterForm = () => {
    return (
        <form className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input type="email" placeholder="ton.email@exemple.com"
                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:border-white/30"/>
            <Button type="submit"
                    className="rounded-xl p-6 text-sm font-semibold text-white shadow transition hover:opacity-95"
                    style={{backgroundImage: theme.gradients.blue}}>
                S’abonner
            </Button>
        </form>
    );
};

export default NewsLetterForm;
