import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/api";

const axiosClient = axios.create({
    baseURL: API_URL, // ton backend Spring
    headers: { "Content-Type": "application/json" },
});

// Intercepteur pour ajouter le token automatiquement
axiosClient.interceptors.request.use((config) => {
    const token = Cookies.get("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;
