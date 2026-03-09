import express from "express";
import { getBills, getMonthlyStats, createBill, deleteBill } from "../controllers/billController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);   // all bill routes are protected

router.get("/", getBills);
router.get("/monthly-stats", getMonthlyStats);
router.post("/", createBill);
router.delete("/:id", deleteBill);

export default router;
