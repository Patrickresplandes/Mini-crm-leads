import useSWR from "swr";
import { getLeads } from "../services/leads.service";
import { LeadStatus } from "../types";

interface UseLeadsParams {
    status?: LeadStatus;
    search?: string;
    page?: number;
}

export function useLeads({ status, search, page = 1}: UseLeadsParams){
    const key = ["leads", status, search, page];

    const {data, error, isLoading, mutate} = useSWR(key, () => 
    getLeads({status,search,page})
    );

    return {
        leads: data?.data ?? [],
        pagination: data?.pagination,
        isLoading,
        isError: !!error,
        mutate,  // força o refetch depois de criar ou editar
    }
}