import api from '../lib/api';
import {Interaction} from '../types'

export async function getInteractions(leadId: string): Promise<Interaction[]>{
    const {data} = await api.get(`/leads/${leadId}/interactions`)
    return data;
}

export async function createInteraction(leadId: string, note: string): Promise<Interaction> {
    const { data } = await api.post(`/leads/${leadId}/interactions`, {note});
    return data;
}

export async function deleteInteraction(leadId: string, interactionId: string): Promise<void>{
    await api.delete(`/leads/${leadId}/interactions/${interactionId}`);
}