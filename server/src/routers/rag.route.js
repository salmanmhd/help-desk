import { Router } from "express";
import {
  agentController,
  ragController,
} from "../controllers/rag.controller.js";

const router = Router();

router.post("/", ragController);
router.post("/agent", agentController);

export default router;
