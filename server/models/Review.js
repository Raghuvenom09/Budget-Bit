import mongoose from "mongoose";

const dishRatingSchema = new mongoose.Schema({
    dishName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    worthIt: { type: Boolean, default: true },
});

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        bill: { type: mongoose.Schema.Types.ObjectId, ref: "Bill" },

        overallRating: { type: Number, min: 1, max: 5, required: true },
        worthItScore: { type: Number, min: 0, max: 100 },         // user's calculated score
        comment: { type: String, maxlength: 500, default: "" },

        dishRatings: [dishRatingSchema],

        // Receipt-scan metadata
        receiptTotal: { type: Number },
        receiptImageUrl: { type: String },

        likes: { type: Number, default: 0 },
        verified: { type: Boolean, default: false },              // verified via bill upload
    },
    { timestamps: true }
);

// One review per user per restaurant
reviewSchema.index({ user: 1, restaurant: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
