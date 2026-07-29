import useSWR from "swr";
import { getMetrics } from "../services/dasboard.service";

export function useMetrics(){
    const { data, error, isLoading } = useSWR("dashboard-metrics", getMetrics, {
        refreshInterval: 3000, // revalida a cada 30s
    });

    return {
        metrics: data,
        isLoading,
        isError:!!error,
    };
}