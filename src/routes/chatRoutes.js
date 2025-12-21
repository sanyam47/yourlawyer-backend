import express from "express";
import { chatAI } from "../controllers/chatController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, chatAI);

export default router;
