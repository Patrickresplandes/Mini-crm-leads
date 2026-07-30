import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import interactionsRoutes from "./routes/interactions.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/leads", leadsRoutes);
app.use("/leads", interactionsRoutes);
app.use("/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
