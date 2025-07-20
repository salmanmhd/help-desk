import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";

const QDRANT_URL = process.env.QDRANT_URL;
const COLLECTION_NAME = process.env.COLLECTION_NAME;
const OLLAMA_URL = process.env.OLLAMA_URL;

const ragController = asyncHandler(async (req, res) => {
  try {
    const { question } = req.body;
    // console.log(`🔴question: ${question}`);
    // 1. Get embeddings for the question
    const embedRes = await axios.post(`${OLLAMA_URL}/api/embeddings`, {
      model: "nomic-embed-text:latest",
      prompt: question,
    });
    const queryVector = embedRes.data.embedding;

    const searchRes = await axios.post(
      `${QDRANT_URL}/collections/${COLLECTION_NAME}/points/search`,
      {
        vector: queryVector,
        top: 3,
        with_payload: true,
      }
    );

    // console.log("🔵 Qdrant search result:", searchRes.data.result);

    const context = searchRes.data.result.map((p) => p.payload.text).join("\n");
    // console.log(`🔴context: `, context);

    const prompt = `You are acting as a customer support agent for Playniya Pvt Ltd. You have to resolve the customer query. Remember dont entertain anything which has scope outside the context. Try to be professional. Keep your answer short and crisp, only to the point no extra things, make it easy to understand and keep the language simple, dont't make it complex. 
    When defining any steps, define it cleary step by step (only if any step is envolved).   
    Use the context to answer the question:\n\n${context}\n\nQuestion: ${question}\nAnswer:`;

    const llamaRes = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: "llama3:latest",
      prompt,
      stream: false,
    });

    res.json({ answer: llamaRes.data.response.trim(), context: context });
  } catch (error) {
    console.error(
      "🔴🔴🔴 Ollama Error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

const socketController = asyncHandler(async (req, res) => {
  // import "./controllers/socket.controller.js";
});

const agentController = asyncHandler(async (req, res) => {
  console.log(
    "send a kafka event with deatils like user id, or whatever is required"
  );
});

export { ragController };
