import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import interactionsRoutes from "./routes/interactions.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import morgan from "morgan";
import logger from "./lib/logger.js";

const app = express();

app.use(cors({
    origin: [
        "https://mini-crm-leads-cyan.vercel.app",
        "https://mini-crm-leads-6cfy-git-main-patrickresplandes-projects.vercel.app",
        "http://localhost:3000",
        "http://localhost:4200",
    ]
}));
app.use(express.json());

app.use(
    morgan("combined", {
        stream: {
            write: (message) => logger.info(message.trim()),
        }
    })
)
app.use("/auth", authRoutes);
app.use("/leads", leadsRoutes);
app.use("/leads", interactionsRoutes);
app.use("/dashboard", dashboardRoutes);


app.use((err: Error, req: express.Request, res:express.Response, next:express.NextFunction) => {
    logger.error(`Error não tratado: ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method
    })
    res.status(500).json({error: "Erro interno do servidor."})
})
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
