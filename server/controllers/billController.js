import Bill from "../models/Bill.js";

// GET /api/bills  (protected — own bills only)
export const getBills = async (req, res) => {
    try {
        const { limit = 20, page = 1 } = req.query;

        const bills = await Bill.find({ user: req.user.id })
            .populate("restaurant", "name image cuisine")
            .sort({ date: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean();

        const total = await Bill.countDocuments({ user: req.user.id });

        // Wallet summary
        const summary = await Bill.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: "$totalAmount" },
                    totalSaved: { $sum: "$savedAmount" },
                    totalBills: { $sum: 1 },
                    avgBill: { $avg: "$totalAmount" },
                },
            },
        ]);

        res.json({ bills, total, summary: summary[0] || {}, page: Number(page) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/bills/monthly-stats  — spending grouped by month
export const getMonthlyStats = async (req, res) => {
    try {
        const stats = await Bill.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                    total: { $sum: "$totalAmount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 12 },
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/bills  (protected)
export const createBill = async (req, res) => {
    try {
        const bill = await Bill.create({ ...req.body, user: req.user.id });
        res.status(201).json(bill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE /api/bills/:id  (protected)
export const deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ message: "Bill not found." });
        if (bill.user.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed." });
        await bill.deleteOne();
        res.json({ message: "Bill deleted." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
