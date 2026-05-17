// Ye controller skill-wise progress calculate karta hai.
// User ke logs ko skill ke naam se group karta hai.
// Har skill ke liye total logs aur total time spent calculate hota hai.
// Result most practiced skill first order me aata hai,
// taaki dashboard par pata chale kis skill par zyada kaam hua hai.

const Log=require("../models/logs-model")
const mongoose=require("mongoose");

// 🔥 Skill-wise Progress Controller
 const getSkillProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Logged in user:", req.user.id);

    // Aggregation pipeline
    const progress = await Log.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: "$skill",
          totalLogs: { $sum: 1 },
          totalTime: { $sum: "$timespent" }
        }
      },
      {
        $project: {
          _id: 0,
          skill: "$_id",
          totalLogs: 1,
          totalTime: 1
        }
      },
      {
        $sort: { totalLogs: -1 } // optional (most practiced skill first)
      }
    ]);

    return res.status(200).json({
      success: true,
      data: progress
    });

  } catch (error) {
    console.error("Error in skill progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch skill progress"
    });
  }
};
module.exports=getSkillProgress;
