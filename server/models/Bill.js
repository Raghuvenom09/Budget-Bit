import mongoose from "mongoose";

const billItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, default: 1 },
});

const billSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },

        // If restaurant not in DB yet, store name as string
        restaurantName: { type: String, default: "" },

        items: [billItemSchema],
        totalAmount: { type: Number, required: true },
        savedAmount: { type: Number, default: 0 },

        // Receipt scan
        receiptImageUrl: { type: String, default: "" },

        // Status
        isRated: { type: Boolean, default: false },
        review: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },

        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Indexes for wallet queries
billSchema.index({ user: 1, date: -1 });

export default mongoose.model("Bill", billSchema);
