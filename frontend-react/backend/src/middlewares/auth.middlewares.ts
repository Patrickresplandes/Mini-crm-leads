import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthPayload{
    userId:string;
}

declare module "express-serve-static-core"{
    interface Request{
        userId?:string;
    }
}
export function authMiddleware (req:Request,res:Response, next:NextFunction){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({error:"Token não fornecido"})
    }
    const [, token] = authHeader.split(" "); //formato Bearer <token>
    if(!token){
    return res.status(401).json({error:"Token mal formatado"})
    }
    try {
        const secret = process.env.JWT_SECRET;
        if(!secret){
            throw new Error("JWT_SECRET não configurado");
        }
        const decoded = jwt.verify(token,secret) as AuthPayload;
        req.userId = decoded.userId;

        next();
    }catch (error){
        return res.status(401).json({error:"Token inválido ou expirado"})
    }
}