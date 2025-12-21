import express from "express";
import { testAIController } from "../controllers/aiController.js";

const router = express.Router();

router.get("/test", testAIController);

export default router;
