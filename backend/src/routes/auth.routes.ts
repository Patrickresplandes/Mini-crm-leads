import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import {z} from "zod";
import logger from "../lib/logger.js";
const router = Router();

const registerSchema= z.object( {
name: z.string().min(2,"Nome muito curto"),
email: z.string().email("Email inválido"),
password: z.string().min(6,"Senha muito curta")
})

router.post("/register",async (req,res) => {
    try {
        const parsed = registerSchema.safeParse(req.body) 
        if(!parsed.success){
            return res.status(400).json({error:parsed.error.issues[0]?.message});
        }

        const {name,email,password} = parsed.data;

        const existingUser = await prisma.user.findUnique({where:{email}});
        if (existingUser){
            return res.status(409).json({error:"Email já cadastrado"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await prisma.user.create({
        data:{name,email,password:hashedPassword},
    });
    return res.status(201).json({id: user.id, name:user.name, email:user.email});
} catch (error) {
    logger.error("Erro  ao registrar usuário",{error});
    return res.status(500).json({error:"Erro ao registrar usuário"});
}
})

router.post("/login",async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({error:"Email e senha obrigatórios"});
        }
        const user = await prisma.user.findUnique({where:{email}});
        if(!user){
            return res.status(401).json({error:"Credenciais inválidas"});
        }
        const passwordMatches = await bcrypt.compare(password,user.password);
        if(!passwordMatches){
            return res.status(401).json({error:"Credenciais inválidas"});
        }
        const secret = process.env.JWT_SECRET;
        if(!secret){
            throw new Error("JWT_SECRET não configurado");
        }
        const token = jwt.sign({userId:user.id},secret,{expiresIn:"7d"});
        return res.json({
            token,
            user: {id:user.id, name: user.name, email: user.email},
        });
    }catch (error){
        logger.error("Erro ao fazer login",{error});
        return res.status(500).json({error:"Erro ao fazer login"});
    }
})
export default router;