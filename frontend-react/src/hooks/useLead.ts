import useSWR from "swr";
import { getLeadById } from "../services/leads.service";

export function useLead(id: string) {
    const { data, error, isLoading, mutate}= useSWR(
        id ? ["lead", id] : null,
        () => getLeadById(id)
    );

    return {
        lead: data,
        isLoading,
        isError : !!error,
        mutate,
    };
}