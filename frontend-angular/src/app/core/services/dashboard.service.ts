import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments.development";
import { DashboardMetrics } from "../models/lead.model";

@Injectable({providedIn:"root"})
export class DashboardService{
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.baseUrl}/dashboard/metrics`)
  }
}
