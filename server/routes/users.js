import express from "express";
import { getProfile, updateProfile, toggleSave } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/save/:restaurantId", toggleSave);

export default router;
