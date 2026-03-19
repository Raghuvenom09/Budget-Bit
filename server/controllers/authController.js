import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { name, email: rawEmail, password } = req.body;
        const email = rawEmail?.toLowerCase().trim();

        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields are required." });

        const exists = await User.findOne({ email });
        if (exists) return res.status(409).json({ message: "Email already registered." });

        const user = await User.create({ name: name.trim(), email, password });
        const token = signToken(user._id);

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, monthlyBudget: user.monthlyBudget },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email: rawEmail, password } = req.body;
        const email = rawEmail?.toLowerCase().trim();

        if (!email || !password)
            return res.status(400).json({ message: "Email and password are required." });

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ message: "Invalid email or password." });

        const token = signToken(user._id);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, monthlyBudget: user.monthlyBudget },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/auth/me  (protected)
// req.user is already populated by the protect middleware — no extra DB round-trip needed
export const getMe = (req, res) => {
    res.json(req.user);
};
