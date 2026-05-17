// Ye controller user ka streak data return karta hai.
// Logged-in user ke liye streak record database se find hota hai.
// Agar streak record nahi mila, to default 0 current streak,
// 0 longest streak aur null lastActiveDate bhejte hain.
// Agar record mila, to wahi streak data response me send hota hai.

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
