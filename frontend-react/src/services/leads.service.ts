import api from '../lib/api';
import {Lead, LeadStatus, PaginatedLeads} from '../types/index';

interface GetLeadsParams {
    status?: LeadStatus;
    search?: string;
    page?: number;
}

export async function getLeads(params: GetLeadsParams = {}) : Promise<PaginatedLeads> {
    const {data} = await api.get("/leads", {params});
    return data;
}

export async function getLeadById(id:string): Promise<Lead> {
    const {data} = await api.get(`/leads/${id}`);
    return data;
}

export async function createLead(payload:Partial<Lead>): Promise<Lead> {
    const {data} = await api.post("/leads", payload);
    return data;
}

export async function updatedLead(id:string, payload: Partial<Lead>): Promise<Lead> {
    const {data} = await api.patch(`/lead/${id}`, payload);
    return data;
}

export async function deleteLead(id: string): Promise<void>{
    await api.delete(`/lead/${id}`);
}
