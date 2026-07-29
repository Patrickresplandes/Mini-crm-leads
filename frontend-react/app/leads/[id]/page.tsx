"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLead } from "@/src/hooks/useLead";
import { LeadForm, LeadFormData } from "@/src/components/LeadForm";
import { updatedLead, deleteLead } from "@/src/services/leads.service";
import { InteractionTimeline } from "@/src/components/InteractionTimeline";

export default function LeadDetailPage(){
    const { id } = useParams<{id: string}>();
    const router = useRouter();
    const {lead, isLoading, isError, mutate} = useLead(id);

    const [ isEditing, setIsEditing]= useState(false);
    const [ error,setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleUpdate(data:LeadFormData) {
        setError(null);
        try {
            await updatedLead(id,data);
            await mutate();
            setIsEditing(false);
        } catch (err: any){
            setError(err.reponse?.data?.error || "Erro ao atualizar lead");
        }
    }

    async function handleDelete(){
        const confirmed = window.confirm(
            "Tem certeza que deseja excluir este lead? essa ação não pode ser desfeita"
        );
        if(!confirmed) return;

        setIsDeleting(true);
        try {
            await deleteLead(id);
            router.push("/leads");
        } catch (err : any){
            setError(err.reponse?.data?.error || "Erro ao excluir lead.")
            setIsDeleting(false);
        }
    }

    if(isLoading){
        return <div className="p-8 text-gray-500">Carregando lead ...</div>
    }
    if(isError || !lead){
        return <div className="p-8 text-red-600">Lead não encontrado.</div>
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    {isEditing ? "Editar Lead" : lead.name}
                </h1>
                {!isEditing && (
                    <div className="flex gap-2">
                        <button onClick={() => setIsEditing(true)} 
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                                Editar
                        </button>
                        <button onClick={handleDelete} disabled={isDeleting} className="px-3 py-2 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50 disabled:opacity-50"> 
                            {isDeleting ? "Excluind..." : "Excluir"}
                        </button>
                    </div>
                )}
            </div>
                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2 mb-4 max-w-md">
                        {error}
                    </p>
                )}

                {isEditing ? (
                    <div>
                        <LeadForm defaultValues={lead} onSubmit={handleUpdate} submitLabel="Salvar alterações"/>
                        <button onClick={() => setIsEditing(false)} className="mt-3 text-sm text-gray-500 hover:underline">
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Empresa</p>
                            <p className="text-gray-900">{lead.company}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="text-gray-900">{lead.status}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Valor estimado</p>
                            <p className="text-gray-900">
                                {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(lead.estimatedValue)}
                                </p>
                        </div>
                    </div>
                )}

                {!isEditing && <InteractionTimeline leadId={id}/>}
        </div>
    )
}
