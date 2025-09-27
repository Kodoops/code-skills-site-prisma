"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axiosClient from "@/lib/api/axiosClient";

type User = { email: string } | null;

const AuthContext = createContext<{
    user: User;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}>({
    user: null,
    login: async () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(null);

    // Au chargement → vérifier si un token existe et récupérer l’utilisateur
    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            axiosClient
                .get("/auth/me")
                .then((res) => setUser({ email: res.data.email }))
                .catch(() => setUser(null));
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res = await axiosClient.post("/auth/login", { email, password });
        const token = res.data.token;
        Cookies.set("token", token);
        setUser({ email });
    };

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
