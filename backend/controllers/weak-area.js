const Log=require("../models/logs-model")
const mongoose=require("mongoose");

 const getWeakAreas = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await Log.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: {
            skill: "$skill",
            topic: "$topic"
          },
          totalLogs: { $sum: 1 },
          solvedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "solved"] }, 1, 0]
            }
          },
          stuckCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "stuck"] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          skill: "$_id.skill",
          topic: "$_id.topic",
          totalLogs: 1,
          solvedCount: 1,
          stuckCount: 1
        }
      }
    ]);

    // 🔥 Apply Weak Logic
    const weakAreas = data.filter(item => {
      const lowPractice = item.totalLogs < 3; // threshold
      const highStruggle = item.stuckCount > item.solvedCount;

      return lowPractice || highStruggle;
    });

    return res.status(200).json({
      success: true,
      weakAreas
    });

  } catch (error) {
    console.error("Error in weak area detection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to detect weak areas"
    });
  }
};

module.exports=getWeakAreas;