import axios from "axios";
import "dotenv/config";

const createCollection = async () => {
  const response = await axios.put(
    `${process.env.QDRANT_URL}/collections/${process.env.COLLECTION_NAME}`,
    {
      vectors: {
        size: 768,
        distance: "Cosine",
      },
    }
  );
  console.log(`🔴 collection data: `, response);
  console.log("Collection created:", response.data);
};

createCollection();
