import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/leads"];

export default function proxy(request: NextRequest){
    console.log("proxy rodou")
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;
    console.log("token", token)

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    if(isProtectedRoute && !token){
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/leads/:path*"],
}