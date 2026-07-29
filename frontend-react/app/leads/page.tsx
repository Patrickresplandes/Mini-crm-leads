"use client";

import { useState } from "react";
import Link from "next/link";
import { useLeads} from "@/src/hooks/useLeads";
import { LeadStatus } from "@/src/types";
import { Danfo } from "next/font/google";


const statusOptions : {value:LeadStatus | ""; label: string}[] = [
    {value: "", label:"Todos"},
    {value: "NOVO", label:"Novo"},
    {value: "CONTATADO", label:"Contatado"},
    {value: "NEGOCIANDO", label:"Negociando"},
    {value: "FECHADO", label:"Fechado"},
    {value: "PERDIDO", label:"Perdido"},
];

const statusColor: Record<LeadStatus,string> = {
    NOVO: "bg-blue-100 text-blue-700",
    CONTATADO: "bg-yellow-100 text-yellow-700",
    NEGOCIANDO: "bg-purple-100 text-purple-700",
    FECHADO: "bg-green-100 text-green-700",
    PERDIDO: "bg-red-100 text-red-700"
};

function formatCurrency(value: number){
    return new Intl.NumberFormat("pt-br", {
        style:"currency",
        currency: "BRL"
    }).format(value);
}

export default function LeadsPage(){
    const [status, setStatus] = useState<LeadStatus | "">("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const {leads, pagination, isLoading, isError} = useLeads({
        status: status || undefined,
        search: search || undefined,
        page,
    });

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
    }

    function handleStatusChange(value: LeadStatus | ""){
        setStatus(value);
        setPage(1);
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
                <Link
                href="/leads/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
                >
                    + Novo Lead
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nome"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                <select value={status} onChange={(e) => handleStatusChange(e.target.value as LeadStatus | "")}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                </select>
            </div>

            {isLoading && <p className="text-gray-500">Carregando leads...</p>}
            {isError && <p className="text-red-600">Erro as carregar leads</p>}

            {!isLoading && !isError && (
                <>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Empresa</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                                            Nenhum Lead encontrado
                                        </td>
                                    </tr>
                                )}

                                {leads.map((lead) => (
                                    <tr key={lead.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer">                                        
                                        <td className="px-4 py-3">
                                            <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:underline">
                                                {lead.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{lead.company}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[lead.status]}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700"> {formatCurrency(lead.estimatedValue)} </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-gray-500">
                                Página {pagination.page} de {pagination.totalPages} ({pagination.totalPages} leads)
                            </p>
                            <div className="flex gap-2">
                                <button onClick={() => setPage((p) => Math.max(1, p-1))}
                                    disabled={page <= 1}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50">
                                        Anterior
                                </button>
                                <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                    disabled={page >= pagination.totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50">
                                        Próxima
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
    )
}
