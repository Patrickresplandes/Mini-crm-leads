"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LeadForm, LeadFormData } from "@/src/components/LeadForm";
import { createLead } from "@/src/services/leads.service";

export default function NewLeadPage(){
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    async function handleCreate(data: LeadFormData){
        setError(null);
        try {
            await createLead(data);
            router.push("/leads");
        } catch (err:any){
            setError(err.response?.data?.error || "Erro ao criar lead.")
        }
    }
    return (
        <div className="p-8">
            <h1 className="text-2x1 font-semibold text-gray-900 mb-6">
                Novo Lead
            </h1>
            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2 mb-4 max-w-md">
                    {error}
                </p>
            )}
            <LeadForm onSubmit={handleCreate} submitLabel="Criar Lead"/>
        </div>
    )
}