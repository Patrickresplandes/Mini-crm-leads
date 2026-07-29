"use client";

import { useMetrics } from "@/src/hooks/useMetrics";

function formatCurrency(value: number){
    return new Intl.NumberFormat("pt-br", {
        style:"currency",
        currency: "BRL",
    }).format(value);
}


export default function DashboardPage(){
    const { metrics, isLoading, isError } = useMetrics(); 

    if(isLoading){
        return <div className="p-8  text-gray-500">Carregando métricas...</div>
    }

    if (isError || !metrics){
        return (
            <div className="p-8 text-red-600">
                Não foi possível carregar as métricas. Tente novamente.
            </div>
        );
    }

    const cards = [
        {
            label:"Total de Leads",
            value: metrics.totalLeads,
        },
        {
            label:"Valor em Negociação",
            value: formatCurrency(metrics.valorEmNegociacao),
        },
        {
            label:"Leads em Negociação",
            value: metrics.leadsEmNegociacao,
        },
        {
            label:"Leads Fechados",
            value: metrics.leadsFechados,
        },
        {
            label:"Taxa de Conversão",
            value: `${metrics.taxaConversao}%`,
        },
    ];
     return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <div
                    key={card.label}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                        <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
   