import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    score: { type: Number, default: 0 },   // community worth-it score (0-100)
    emoji: { type: String, default: "🍽️" },
});

const restaurantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        cuisine: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, default: "" },
        image: { type: String, default: "🍽️" },       // emoji fallback
        imageUrl: { type: String, default: "" },            // real photo URL (future)
        priceForTwo: { type: Number, required: true },
        distance: { type: Number, default: 0 },             // km, user-specific (computed)
        tag: { type: String, default: "" },
        tagColor: { type: String, default: "#E8360A" },

        // Scores – recomputed from reviews
        worthItScore: { type: Number, default: 0 },
        googleRating: { type: Number, default: 0 },
        socialBuzz: { type: Number, default: 0 },
        communityReviews: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },

        topDishes: [dishSchema],

        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

// Text index for search
restaurantSchema.index({ name: "text", cuisine: "text", city: "text" });

export default mongoose.model("Restaurant", restaurantSchema);
