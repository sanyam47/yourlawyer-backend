import express from "express";
import {
  saveLawyerProfile,
  getLawyerProfile,
} from "../controllers/lawyerController.js";
import { protectLawyer } from "../middleware/protectLawyer.js";

const router = express.Router();

// Lawyer profile routes (LAWYER ONLY)
router.post("/profile", protectLawyer, saveLawyerProfile);
router.get("/profile", protectLawyer, getLawyerProfile);

export default router;
