import Cookies from 'js-cookie';
import api from '../lib/api';

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export async function login(payload:LoginPayload) {
    const {data} = await api.post("/auth/login", payload);
    Cookies.set("token", data.token, {expires: 7, sameSite:'Strict'})
    return data;
}

export async function register(payload: RegisterPayload){
    const {data} = await api.post("/auth/register", payload);
    return data;
}

export function logout(){
    Cookies.remove("token");
}

