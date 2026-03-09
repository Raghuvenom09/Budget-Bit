import Review from "../models/Review.js";
import { recomputeScores } from "./restaurantController.js";

// GET /api/reviews?restaurant=<id>
export const getReviews = async (req, res) => {
    try {
        const filter = {};
        if (req.query.restaurant) filter.restaurant = req.query.restaurant;
        if (req.query.user) filter.user = req.query.user;

        const reviews = await Review.find(filter)
            .populate("user", "name avatar")
            .populate("restaurant", "name")
            .sort({ createdAt: -1 })
            .lean();

        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/reviews  (protected)
export const createReview = async (req, res) => {
    try {
        const { restaurant, overallRating, worthItScore, comment, dishRatings, bill } = req.body;

        const existing = await Review.findOne({ user: req.user.id, restaurant });
        if (existing) return res.status(409).json({ message: "You already reviewed this restaurant." });

        const review = await Review.create({
            user: req.user.id, restaurant, overallRating, worthItScore,
            comment, dishRatings, bill,
            verified: !!bill,
        });

        // Recompute restaurant aggregate scores
        await recomputeScores(restaurant);

        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT /api/reviews/:id  (protected — own review only)
export const updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found." });
        if (review.user.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed." });

        Object.assign(review, req.body);
        await review.save();

        await recomputeScores(review.restaurant);
        res.json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE /api/reviews/:id  (protected)
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found." });
        if (review.user.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed." });

        const restaurantId = review.restaurant;
        await review.deleteOne();
        await recomputeScores(restaurantId);

        res.json({ message: "Review deleted." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
