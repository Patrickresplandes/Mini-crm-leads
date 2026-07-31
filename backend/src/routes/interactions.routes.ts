import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import logger from "../lib/logger.js";

const router = Router();

router.use(authMiddleware);

const interactionSchema = z.object({
    note: z.string().min(1, "A nota não pode ser vazia"),
});

// Criar interação
router.post("/:leadId/interactions", async (req,res) =>{
    try {
        const {leadId} = req.params;

        const parsed = interactionSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({error: parsed.error.issues[0]?.message});
        }

        const lead = await prisma.lead.findUnique({where: {id: leadId}});
        if(!lead){
            return res.status(404).json({error: "Lead não encontrado"})
        }

        const interaction = await prisma.interaction.create({
            data: {
                note: parsed.data.note,
                leadId,
            }
        })
        return res.status(201).json(interaction);
    } catch (error){
        logger.error("Erro ao criar interação",{error});
        return res.status(500).json({error: "Erro ao criar interação"});
    }
})

//Listar interações

router.get("/:leadId/interactions", async (req,res) => {
    try {
        const {leadId} = req.params;
        const lead = await prisma.lead.findUnique({where: {id: leadId}});
        if(!lead){
            return res.status(404).json({error:"Lead não encontrado"});
        }

        const interactions = await prisma.interaction.findMany({where:{leadId}, orderBy:{createdAt:"desc"},});

        return res.json(interactions);
    } catch (error){
        console.error("Erro ao listar interações",{error})
        return res.status(500).json({error: "Erro ao listar interações"});
    }
});

//Deletar uma interação
router.delete("/:leadId/interactions/:interactionId", async (req,res) => {
    try {
        const {leadId, interactionId} = req.params;
        const interaction = await prisma.interaction.findUnique({where:{ id : interactionId},});

        if (!interaction || interaction.leadId !== leadId){
            return res.status(404).json({error:"Interação não encontrada"});
        }
        await prisma.interaction.delete({where: {id: interactionId},});

        return res.status(204).send();

    } catch (error){
        logger.error("Erro ao deletar interação",{error});
        return res.status(500).json({error: "Erro ao deletar interação"});
    }
})

export default router;