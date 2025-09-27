import React from 'react';
import {theme} from "@/lib/theme";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

const NewsLetterForm = () => {
    return (
        <form className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Input type="email" placeholder="ton.email@exemple.com"
                   className="h-12 rounded-lg placeholder:text-muted-foreground/30"/>
            <Button type="submit"
                    className="rounded-lg p-6 text-sm font-semibold text-white shadow transition hover:opacity-95"
                    style={{backgroundImage: theme.gradients.blue}}>
                S’abonner
            </Button>
        </form>
    );
};

export default NewsLetterForm;
