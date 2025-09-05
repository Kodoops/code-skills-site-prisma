import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

export async function requireUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return redirect("/login");
    }

    return session.user;
}
