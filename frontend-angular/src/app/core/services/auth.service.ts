import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environments.development";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {id: string; name: string; email:string}
}

@Injectable({providedIn: "root"})
export class AuthService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl;

  login(payload: LoginPayload): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, payload).pipe(
      tap((response) => {
        document.cookie = `token=${response.token}; path=/; max-age=${60*60*24*7}`;
      })
    )
  }

  register(payload: RegisterPayload): Observable<any>{
    return this.http.post(`${this.baseUrl}/auth/register`, payload)
  }

  logout(){
    document.cookie="token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}
