import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(authMiddleware);

router.get("/metrics", async (req,res) => {
    try {
        const [totalLeads, negociando, fechados, todosLeads] = await Promise.all([
            prisma.lead.count(),
            prisma.lead.aggregate({
                where: {status: "NEGOCIANDO"},
                _sum: {estimatedValue: true},
                _count: true,
            }),
            prisma.lead.count({where: {status: "FECHADO"}}),
            prisma.lead.count({where: {status: { in: ["FECHADO", "PERDIDO"]}},
            })
        ]);
        const taxaConversao = todosLeads > 0 ? (fechados / todosLeads) * 100 : 0;

        return res.json({
            totalLeads,
            valorEmNegociacao: negociando._sum.estimatedValue ?? 0,
            leadsEmNegociacao: negociando._count,
            leadsFechados: fechados,
            taxaConversao: Number(taxaConversao.toFixed(2)),
        })
    }catch (error){
        console.error(error);
        return res.status(500).json({error: "Erro ao buscar métricas"})
    }
})

export default router;