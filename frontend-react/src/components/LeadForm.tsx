"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod"
import { Lead, LeadStatus } from "../types";

const leadFormSchema = z.object({
    name: z.string().min(2, "Nome muito curto"),
    company: z.string().min(2, "Empresa muito curta"),
    status: z.enum(["NOVO", "CONTATADO", "NEGOCIANDO", "FECHADO", "PERDIDO"]),
    estimatedValue: z.coerce.number().nonnegative("Valor não pode ser negativo"),
});

type LeadFormInput = z.input<typeof leadFormSchema>;
export type LeadFormData = z.output<typeof leadFormSchema>;

interface LeadFormProps {
    defaultValues?: Partial<Lead>;
    onSubmit: (data: LeadFormData) => Promise<void>;
    submitLabel?: string;
}

const statusOption : {value : LeadStatus, label: string}[] = [
    {value:"NOVO", label:"Novo"},
    {value:"CONTATADO", label:"Contatado"},
    {value:"NEGOCIANDO", label:"Negociando"},
    {value:"FECHADO", label:"Fechado"},
    {value:"PERDIDO", label:"Perdido"}
];

export function LeadForm ({ defaultValues, onSubmit, submitLabel = "Salver"}: LeadFormProps){
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<LeadFormInput, any, LeadFormData>({
        resolver: zodResolver(leadFormSchema),
        defaultValues:{
            name: defaultValues?.name ?? "",
            company: defaultValues?.company ?? "",
            status: defaultValues?.status ?? "NOVO",
            estimatedValue: defaultValues?.estimatedValue ?? 0,
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do lead
                </label>
                <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

             <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                </label>
                <input
                    id="company"
                    type="text"
                    {...register("company")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company.message}</p>}
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                </label>
                <select
                    id="status"
                    {...register("status")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                {statusOption.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
                </select>
                {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>}
            </div>

            <div>
                <label htmlFor="estimatedValue" className="block text-sm font-medium text-gray-700 mb-1">
                    Valor estimado (R$)
                </label>
                <input
                    id="estimatedValue"
                    type="number"
                    step="0.01"
                    {...register("estimatedValue")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
                />
                {errors.estimatedValue && (
                    <p className="text-sm text-red-600 mt-1">{errors.estimatedValue.message}</p>
                )}
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled::opacity-50 transition">
                {isSubmitting ? "Salvando.." : submitLabel}
            </button>
        </form>
    )
}