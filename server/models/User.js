import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6, select: false },
        avatar: { type: String, default: "" },

        // Budget preferences
        monthlyBudget: { type: Number, default: 3000 },
        favCuisines: [{ type: String }],

        // Saved / wishlist restaurants
        savedRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
