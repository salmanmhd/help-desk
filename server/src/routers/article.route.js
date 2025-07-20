import { Router } from "express";
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticlesByTopic,
  getMostAskedArticles,
  getRecentArticles,
  updateArticle,
} from "../controllers/article.controller.js";

const router = Router();

router.get("/recent", getRecentArticles);
router.get("/id/:id", getArticleById);
router.get("/top", getMostAskedArticles);
router.get("/topic/:topicId", getArticlesByTopic);
router.post("/", createArticle);
router.delete("/:id", deleteArticle);
router.put("/:id", updateArticle);

export default router;
