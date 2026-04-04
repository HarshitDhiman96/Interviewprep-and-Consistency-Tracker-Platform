//core idea=
// Consistency = (Number of days user studied / Total days span) * 100
// 🔍 Example

// Logs:

// 20 March ✅
// 21 March ❌
// 22 March ✅

// 👉 Total days = 3
// 👉 Active days = 2

// 👉 Consistency = *(2/3)100 = 66%

const Log=require("../models/logs-model")
const mongoose=require("mongoose");

 const getConsistency = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Get unique active days
    const activeDaysData = await Log.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          }
        }
      },
      {
        $count: "activeDays"
      }
    ]);

    const activeDays = activeDaysData[0]?.activeDays || 0;

    // Step 2: Get first and last log dates
    const dateRange = await Log.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: null,
          firstDate: { $min: "$createdAt" },
          lastDate: { $max: "$createdAt" }
        }
      }
    ]);

    // If no logs
    if (!dateRange.length) {
      return res.json({
        consistency: 0
      });
    }

    const { firstDate, lastDate } = dateRange[0];

    // Step 3: Calculate total days using calendar dates, not raw timestamps.
    // This keeps multiple logs on the same day from inflating the date span.
    const normalizedFirstDate = new Date(firstDate);
    const normalizedLastDate = new Date(lastDate);

    normalizedFirstDate.setHours(0, 0, 0, 0);
    normalizedLastDate.setHours(0, 0, 0, 0);

    const diffTime = normalizedLastDate - normalizedFirstDate;
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Step 4: Calculate consistency
    const consistency = Math.round((activeDays / totalDays) * 100);

    return res.status(200).json({
      success: true,
      consistency,
      activeDays,
      totalDays
    });

  } catch (error) {
    console.error("Error in consistency:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate consistency"
    });
  }
};

module.exports=getConsistency;
