import useSWR from "swr";
import { getInteractions } from "../services/interactions.service";

export function useInteractions(leadId: string){
    const {data, error, isLoading, mutate} = useSWR(
        leadId ? ["interactions", leadId] : null,
        ()=> getInteractions(leadId)
    );

    return {
        interactions: data ?? [],
        isLoading,
        isError: !!error,
        mutate,
    }
}