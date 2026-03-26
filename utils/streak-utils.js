const Streak= require("../models/streak_model")

const updateStreak = async (userId) => {
  try {
    // console.log(userId);
    // Normalize today's date
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    // Yesterday
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Find streak
    let streak = await Streak.findOne({ userId });

    // 🆕 First time user
    if (!streak) {
      await Streak.create({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today
      });
      return;
    }

    let lastDate = new Date(streak.lastActiveDate);
    lastDate.setHours(0, 0, 0, 0);

    // ❗ Same day → do nothing
    if (lastDate.getTime() === today.getTime()) {
      return;
    }

    // ✅ Yesterday → increase streak
    if (lastDate.getTime() === yesterday.getTime()) {
      streak.currentStreak += 1;
    } 
    // ❌ Gap → reset
    else {
      streak.currentStreak = 1;
    }

    // Update longest streak
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    // Update last active date
    streak.lastActiveDate = today;

    await streak.save();

  } catch (error) {
    console.error("Error updating streak:", error);
  }
};
module.exports=updateStreak;