import express from "express";
import { getOnlineRecommendations } from "../controllers/onlineRecommendationController.js";

const router = express.Router();

// ⚠️ No auth middleware temporarily
router.get("/", getOnlineRecommendations);

export default router;
