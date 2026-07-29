import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
})

//injetar o token JWT automaticamente em todas as reqs
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined"){
        const token = Cookies.get("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config;
});


// tratar error de tokem expirado/invalido
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401 && typeof window !== "undefined"){
            Cookies.remove("token");
            window.location.href = "/login"
        }
        return Promise.reject(error);
    }
);

export default api;