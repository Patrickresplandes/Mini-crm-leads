import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments.development";
import { Lead, LeadStatus, PaginatedLeads } from "../models/lead.model";

interface GetLeadsParams {
  status?: LeadStatus;
  search?: string;
  page?: number;
}

@Injectable({providedIn: "root"})
export class LeadService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/leads`;

  getLeads(params: GetLeadsParams = {}): Observable<PaginatedLeads> {
    let httParams = new HttpParams();
    if(params.status) httParams = httParams.set("status", params.status);
    if(params.search) httParams = httParams.set("search", params.search);
    if(params.page) httParams = httParams.set("page", params.page.toString());

    return this.http.get<PaginatedLeads>(this.baseUrl, { params: httParams});
  }

  getLeadById(id: string): Observable<Lead>{
    return this.http.get<Lead>(`${this.baseUrl}/${id}`);
  }
  createLead(payload: Partial<Lead>): Observable<Lead>{
    return this.http.post<Lead>(this.baseUrl, payload);
  }
  updateLead(id: string, payload: Partial<Lead>): Observable<Lead>{
    return this.http.patch<Lead>(`${this.baseUrl}/${id}`, payload);
  }
  deleteLead(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
  }
}
