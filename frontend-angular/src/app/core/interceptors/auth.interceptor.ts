import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = getCookie("token")

  const clonedResquest = token
  ? req.clone({
    setHeaders: { Authorization : `Bearer ${token}`}
  })
  : req;

  return next(clonedResquest).pipe(
    catchError((error) => {
      if(error.status === 401){
        deleteCookie("token");
        router.navigate(["/login"])
      }
      return throwError(() => error)
    })
  )
};

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

function deleteCookie(name:string){
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/:`;
}
