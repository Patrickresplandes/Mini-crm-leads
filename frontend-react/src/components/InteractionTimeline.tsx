"use client";

import { useState } from "react";
import { useInteractions } from "../hooks/useInteractions";
import { createInteraction, deleteInteraction } from "../services/interactions.service";
import { date } from "zod";

interface InteractionTimelineProps {
    leadId: string;
}

function formatDate(dateString: string){
    return new Intl.DateTimeFormat("pt-br",{
        day:"2-digit",
        month:"2-digit",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit",
    }).format(new Date(dateString));
}

export function InteractionTimeline({leadId}: InteractionTimelineProps){
    const { interactions, isLoading, isError, mutate } = useInteractions(leadId);
    const [ note, setNote ] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleAddInteraction(e: React.FormEvent){
        e.preventDefault();


        if(!note.trim()){
            setError("A nota não pode ser vazia")
            return;
        }
        setError(null);
        setIsSubmitting(true);

        try {
            await createInteraction(leadId, note.trim());
            setNote("")
            await mutate();
        } catch (err: any){
            setError(err.response?.data?.error || "Erro ao adicionar interação")
        }finally{
            setIsSubmitting(false);
        }
    }

    async function handleDelete(interactionId: string){
        const confirmed = window.confirm("Excluir esta interação?")
        if (!confirmed) return;

        try{
            await deleteInteraction(leadId, interactionId)
             await mutate()
        } catch ( err: any){
            setError(err.response?.data?.error || "Erro ao excluir interação.")
        }
    }

    return (
        <div className="mt-8 max-w-md">
            <h2 className="text-lg font semibold text-gray-900 mb-4"> 
                Histórico de Interação
            </h2>
            <form onSubmit={handleAddInteraction} className="mb-6">
                <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Registrar uma nova interação..." rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus: outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
                <button type="submit" disabled={isSubmitting} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition">
                    {isSubmitting ? "Adicionando..." : "Adicinar interação"}
                </button>
            </form>

            {isLoading && <p className="text-gray-500 text-sm">Carregando interações...</p>}
            {isError && <p className="text-red-600 text-sm">Erro ao carregar interações.</p>}
        
            {!isLoading && !isError &&(
                <div className="space-y-3">
                    {interactions.length === 0 && (
                        <p className="text-gray-500 text-sm">Nenhuma interação registrada ainda</p>
                    )}

                    {interactions.map((interaction) => (
                        <div key={interaction.id} className="bg-white border border-gray-200 rounded-md p-3 flex justify-between items-start gap-3">
                            <div>
                                <p className="text-gray-900 text-sm">{interaction.note}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatDate(interaction.createdAt)}</p>
                            </div>
                            <button onClick={() => handleDelete(interaction.id)} className="text-xs text-red-500 hover:underline shrink-0">
                                Excluir
                            </button>
                        </div>
                    ))}
                </div>
            )}
        
        </div>
    )
}