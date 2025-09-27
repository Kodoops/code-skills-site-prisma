"use client"

import {authClient} from "@/lib/providers/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export function useSignOut() {
    const router = useRouter();

    const handleSignOut = async function signOut() {

        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/"); // redirect to login page
                    toast.success("Signed Out with success");
                },
                onError: (error) => {
                    toast.success("Signed Out Error");
                    console.log(error);
                },
            },
        });
    }

    return handleSignOut;
}
