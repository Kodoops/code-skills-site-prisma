import "server-only"

import {auth} from "@/lib/providers/auth";
import {redirect} from "next/navigation";
import {headers} from "next/headers";
import {cache} from "react";

export const  requireAdmin =  cache(async () => {
    const session = await auth.api.getSession(
        {
            headers: await headers()
        }
    );
    if(!session) {
        return redirect("/login");
    }

    if(session.user.role !== "admin") {
        return redirect("/not-admin");
    }

    return session;
});
