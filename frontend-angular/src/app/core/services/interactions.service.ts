import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environments.development";
import { Interaction } from "../models/lead.model";

@Injectable({providedIn: "root"})
export class InteractionService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;


  getInteractions(leadId: string): Observable<Interaction[]>{
    return this.http.get<Interaction[]>(`${this.baseUrl}/leads/${leadId}/interactions`)
  }

  createIntection(leadId: string, note: string): Observable<Interaction> {
    return this.http.post<Interaction>(`${this.baseUrl}/leads/${leadId}/interactions`, {note})
  }

  deleteInteraction(leadId: string, interactionId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/leads/${leadId}/interactions/${interactionId}`
    )
  }
}
