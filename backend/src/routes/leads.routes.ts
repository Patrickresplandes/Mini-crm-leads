import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";


const router = Router();

router.use(authMiddleware);

const leadsSchema = z.object({
    name: z.string().min(2,"Nome muito curto"),
    company: z.string().min(2,"Nome da empresa muito curto"),
    status: z.enum(["NOVO","CONTATADO", "NEGOCIANDO", "FECHADO", "PERDIDO"]).optional(),
    estimatedValue: z.number().nonnegative().optional(),
})

//lista os lead 

router.get("/", async (req, res) => {
    try {
        const {status, search, page = 1} = req.query;

        const pageNumber = Math.max(1, parseInt(page as string, 10) || 1);
        const pageSize = 10;

        const where: any ={}

        if(status){
            where.status = status;
        }
        if(search){
            where.name = { contains: search as string, mode: "insensitive"};
        }
        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                skip:(pageNumber - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: "desc"},
            }),
            prisma.lead.count({where}),
        ]);
        return res.json({
            data:leads,
            pagination:{
                page: pageNumber,
                pageSize,
                total,
                totalPages: Math.ceil(total/ pageSize),
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"Erro ao listar leads"})
    }
});

//busca lead por id
router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const lead = await prisma.lead.findUnique({
            where:{id},
            include: { interactions: {orderBy: { createdAt: "desc"}}},
        })
        if(!lead){
            return res.status(404).json({error:"Lead não encontrado"});
        }
        return res.json(lead);

    } catch (error){
        console.error(error);
        return res.status(500).json({error:"Erro ao buscar lead"});
    }
});

//criar lead

router.post("/", async ( req, res) => {
    try {
        const parsed = leadsSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({error: parsed?.error?.issues[0]?.message})
        }

        const lead = await prisma.lead.create({
            data: parsed.data,
        });

        return res.status(201).json(lead);
    } catch (error){
        console.error(error);
        return res.status(500).json({error: "Erro ao criar lead"})
    }
});

//Atualiza lead
router.patch("/:id", async (req, res) => {
    try {
        const{id} = req.params;
        const partialSchema = leadsSchema.partial();
        const parsed = partialSchema.safeParse(req.body);
        if( !parsed.success){
            return res.status(400).json({error: parsed?.error?.issues[0]?.message})
        }
        const existingLead = await prisma.lead.findUnique({where:{id}});
        if(!existingLead){
            return res.status(404).json({error:"Lead não encontrado"})
        }
        const lead = await prisma.lead.update({
            where: {id},
            data:parsed.data,
        });
        return res.json(lead);
    } catch (error){
        console.error(error);
        return res.status(500).json({error: "Erro ao atualizar lead"})
    }
});

//deletar lead
router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const existingLead = await prisma.lead.findUnique({where:{id}});
        if(!existingLead){
            return res.status(404).json({error:"Lead não encontrado"})
        }
        await prisma.lead.delete({where:{id}});
        return res.status(204).send();
    } catch (error){
        console.error(error);
        return res.status(500).json({error: "Erro ao deletar lead"})
    }
});
export default router;