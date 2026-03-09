import User from "../models/User.js";

// GET /api/users/profile  (protected)
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate("savedRestaurants", "name cuisine image worthItScore")
            .lean();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/users/profile  (protected)
export const updateProfile = async (req, res) => {
    try {
        const allowed = ["name", "avatar", "monthlyBudget", "favCuisines"];
        const updates = {};
        allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST /api/users/save/:restaurantId  (toggle save)
export const toggleSave = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const id = req.params.restaurantId;
        const idx = user.savedRestaurants.indexOf(id);

        if (idx === -1) user.savedRestaurants.push(id);
        else user.savedRestaurants.splice(idx, 1);

        await user.save();
        res.json({ saved: idx === -1, savedRestaurants: user.savedRestaurants });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
