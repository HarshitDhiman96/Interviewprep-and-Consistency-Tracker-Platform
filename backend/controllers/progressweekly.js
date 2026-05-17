// Ye controller user ka weekly progress summary banata hai.
// Logs ko ISO week aur year ke hisaab se group karta hai.
// Har week ke liye total logs aur total time spent calculate hota hai.
// Data oldest week se latest week order me return hota hai,
// taaki chart/dashboard weekly progress dikha sake.

const Log = require("../models/logs-model");
const mongoose = require("mongoose");

// 🔥 Weekly Progress Controller
const progressweekly = async (req, res) => {
    try {
        const userId = req.user.id;

        const weeklyData = await Log.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $addFields: {
                    week: { $isoWeek: "$createdAt" },
                    year: { $isoWeekYear: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: {
                        week: "$week",
                        year: "$year"
                    },
                    totalLogs: { $sum: 1 },
                    totalTime: { $sum: "$timespent" }
                }
            },
            {
                $project: {
                    _id: 0,
                    week: "$_id.week",
                    year: "$_id.year",
                    totalLogs: 1,
                    totalTime: 1
                }
            },
            {
                $sort: {
                    year: 1,
                    week: 1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: weeklyData
        });

    } catch (error) {
        console.error("Error in weekly progress:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch weekly progress"
        });
    }
};

module.exports = progressweekly;
