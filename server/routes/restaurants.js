import express from "express";
import {
    getRestaurants, getRestaurant, createRestaurant, updateRestaurant
} from "../controllers/restaurantController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:id", getRestaurant);
router.post("/", protect, createRestaurant);
router.put("/:id", protect, updateRestaurant);

export default router;
