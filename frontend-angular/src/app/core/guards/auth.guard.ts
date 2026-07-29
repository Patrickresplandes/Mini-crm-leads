import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = () => {
const router = inject(Router);
const token = getCookie("token")

if(!token){
  router.navigate(["/login"])
  return false;
}

return true;
}

function getCookie(name: string) : string | null{
  const match = document.cookie.match( new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null;
}
