import express from "express";
import axios from "axios";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";
import { createServer } from "http";
import articleRoute from "./routers/article.route.js";
import topicRoute from "./routers/topic.route.js";
import ragRoute from "./routers/rag.route.js";

const QDRANT_URL = process.env.QDRANT_URL;
const COLLECTION_NAME = process.env.COLLECTION_NAME;
const OLLAMA_URL = process.env.OLLAMA_URL;

const app = express();
const server = createServer(app);



app.use(express.json());
app.use(helmet());

app.use(
  cors({
    origin: ["*", "http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  })
);

app.use("/api/v1/article", articleRoute);
app.use("/api/v1/topic", topicRoute);
app.use("/api/v1/ask", ragRoute);


app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export { app, server };
