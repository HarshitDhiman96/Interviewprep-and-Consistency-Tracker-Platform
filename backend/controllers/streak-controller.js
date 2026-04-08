const Streak=require("../models/streak_model");

const getStreak = async (req, res) => {
  const userId = req.user.id;

  const streak = await Streak.findOne({ userId });

  if (!streak) {
    return res.json({
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null
    });
  }

  res.json(streak);
};
module.exports=getStreak;