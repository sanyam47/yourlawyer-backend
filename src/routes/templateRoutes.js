import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { generateTemplate } from "../controllers/templateController.js";

const router = express.Router();

router.post("/generate", verifyToken, generateTemplate);

export default router;
