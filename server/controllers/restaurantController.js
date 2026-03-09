import Restaurant from "../models/Restaurant.js";
import Review from "../models/Review.js";

// GET /api/restaurants  — list with optional filters
export const getRestaurants = async (req, res) => {
    try {
        const { cuisine, search, sort = "worthItScore", limit = 20, page = 1 } = req.query;

        const filter = {};
        if (cuisine && cuisine !== "All") filter.cuisine = cuisine;
        if (search) filter.$text = { $search: search };

        const sortMap = {
            worthItScore: { worthItScore: -1 },
            rating: { rating: -1 },
            priceAsc: { priceForTwo: 1 },
            priceDsc: { priceForTwo: -1 },
        };

        const restaurants = await Restaurant.find(filter)
            .sort(sortMap[sort] || sortMap.worthItScore)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean();

        const total = await Restaurant.countDocuments(filter);

        res.json({ restaurants, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/restaurants/:id
export const getRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).lean();
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found." });
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/restaurants  (protected)
export const createRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.create({ ...req.body, addedBy: req.user.id });
        res.status(201).json(restaurant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT /api/restaurants/:id  (protected — only by adder)
export const updateRestaurant = async (req, res) => {
    try {
        const r = await Restaurant.findById(req.params.id);
        if (!r) return res.status(404).json({ message: "Not found." });
        if (r.addedBy?.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed." });

        Object.assign(r, req.body);
        await r.save();
        res.json(r);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PATCH /api/restaurants/:id/scores — internal helper to recompute scores
export const recomputeScores = async (restaurantId) => {
    const reviews = await Review.find({ restaurant: restaurantId });
    if (!reviews.length) return;

    const avg = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;

    const overallRatings = reviews.map((r) => r.overallRating);
    const worthItScores = reviews.filter((r) => r.worthItScore).map((r) => r.worthItScore);

    await Restaurant.findByIdAndUpdate(restaurantId, {
        rating: +avg(overallRatings).toFixed(1),
        worthItScore: worthItScores.length ? Math.round(avg(worthItScores)) : 0,
        communityReviews: reviews.length,
    });
};
