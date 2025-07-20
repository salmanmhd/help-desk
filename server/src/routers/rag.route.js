import {Router} from "express"
import {ragController} from "../controllers/rag.controller.js"

const router = Router()

router.post("/", ragController)

export default router