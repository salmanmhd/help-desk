// embedDocs.js
import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

dotenv.config();

const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
const QDRANT_COLLECTION = process.env.COLLECTION_NAME || "rag_docs";
const OLLAMA_EMBEDDING_MODEL =
  process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text:latest";

const CHUNK_SIZE = 750;

function chunkText(text, size = CHUNK_SIZE) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

async function getEmbedding(text) {
  try {
    const response = await axios.post("http://localhost:11434/api/embeddings", {
      model: OLLAMA_EMBEDDING_MODEL,
      prompt: text,
    });
    return response.data.embedding;
  } catch (error) {
    console.error(
      "❌ Embedding error:",
      error?.response?.data || error.message
    );
    return null;
  }
}

async function processPDF(filePath) {
  // const buffer = fs.readFileSync(filePath);
  // const { text } = await pdf(buffer);
  const buffer = fs.readFileSync(filePath);
  const { text } = await pdfParse(buffer);

  const fileName = path.basename(filePath);
  return chunkText(text)
    .map((chunk, i) => ({
      id: uuidv4(),
      payload: { source: fileName, chunk: i },
      vector: null,
      text: chunk.trim(),
    }))
    .filter((doc) => doc.text.length > 0);
}

async function embedAndStore(documents) {
  const vectors = [];

  for (const doc of documents) {
    const embedding = await getEmbedding(doc.text);
    if (embedding && embedding.length > 0) {
      vectors.push({
        id: uuidv4(),
        payload: {
          ...doc.payload,
          text: doc.text,
        },
        vector: embedding,
      });

      console.log(
        `✅ Embedded chunk from ${doc.payload.source} — size: ${doc.text.length}`
      );
    }
  }

  try {
    await axios.put(
      `${QDRANT_URL}/collections/${QDRANT_COLLECTION}/points?wait=true`,
      {
        points: vectors,
      }
    );
    console.log("📦 Successfully indexed all vectors to Qdrant");
  } catch (error) {
    console.error("🔥 Qdrant error:", error?.response?.data || error.message);
  }
}

async function run() {
  //   const docsDir = path.join(process.cwd(), "docs");
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Go two levels up from utils/ to reach project root, then into docs/
  const docsDir = path.join(__dirname, "..", "..", "docs");
  const files = fs.readdirSync(docsDir).filter((f) => f.endsWith(".pdf"));

  let allChunks = [];

  for (const file of files) {
    const filePath = path.join(docsDir, file);
    console.log(`📄 Processing ${file}...`);
    const chunks = await processPDF(filePath);
    allChunks.push(...chunks);
  }

  if (allChunks.length === 0) {
    console.warn("⚠️ No chunks found to embed.");
    return;
  }

  await embedAndStore(allChunks);
}

run();
