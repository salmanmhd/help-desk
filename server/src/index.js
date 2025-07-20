import "dotenv/config";
import { connectDb } from "./connection/dbConnect.js";
import { server } from "./app.js";
import "./controllers/socket.controller.js";

const PORT = process.env.PORT;

connectDb()
  .then(() => {
    server.on("error", (error) => {
      console.log(`Express server error: ${error}`);
    });

    server.listen(PORT, () => {
      console.log(`server running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Mongo connection failed: ${error}`);
  });
