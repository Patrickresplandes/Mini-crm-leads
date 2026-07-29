"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod"
import { login } from "@/src/services/auth.service";


const loginSchema = z.object ({
    email: z.string().email("E-mail invalido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage(){
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null)
    const [isLoading,setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState : { errors},
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    async function  onSubmit(data:LoginFormData) {
        setServerError(null);
        setIsLoading(true);

        try {
            await login(data);
            router.push("/dashboard");
        } catch ( error: any){
            const message = error.response?.data?.error || "Erro ao fazer login.";
            setServerError(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
                <h1 className=" text-2xl font-semibold mb-6 text-gray-900">
                    Entrar
                </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    { errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                    )}
                </div>
                
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Senha
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    { errors.password && (
                        <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                    )}
                </div>
                {serverError && (
                    <p className=" text-sm text-red-600 bg-red-50 border border-red-20 rounded-md p-2">
                        {serverError}
                    </p>
                )}

                <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    {isLoading ? "Entrando" : "Entrar"}
                </button>
            </form>
            </div>
        </div>
    )
}