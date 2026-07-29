export type LeadStatus = "NOVO" | "CONTATADO" |  "NEGOCIANDO" | "FECHADO" | "PERDIDO";

export interface Lead {
  id: string;
  name: string;
  company:string;
  status: LeadStatus;
  estimatedValue: number;
  createdAt: string;
  updateAt:string;
}

export interface Interaction {
id: string;
note: string;
leadId: string;
createdAt: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  valorEmNegociacao: number;
  leadsEmNegociacao: number;
  leadsFechados: number;
  taxaConversao: number;
}

export interface PaginatedLeads {
  data: Lead[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }
}
