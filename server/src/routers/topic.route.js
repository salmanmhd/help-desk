import { Router } from "express";
import {
  createTopic,
  deleteTopic,
  updateTopic,
  getTopicById,
  getTopics,
} from "../controllers/topic.controller.js";

const router = Router();

router.post("/", createTopic);
router.get("/", getTopics);
router.get("/id/:id", getTopicById);
router.put("/:id", updateTopic);
router.delete("/:id", deleteTopic);

export default router;
