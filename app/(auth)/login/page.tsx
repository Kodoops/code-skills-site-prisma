import LoginForm from "@/app/(auth)/login/_components/LoginForm";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {headers} from "next/headers";

const LoginPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(session) {
        return redirect("/")
    }

    return (
        <LoginForm/>
    );
};

export default LoginPage;
