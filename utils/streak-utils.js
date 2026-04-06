const Streak = require("../models/streak_model");
const { calculateNextStreakState } = require("./streak-logic");

const updateStreak = async (userId) => {
  try {
    const streak = await Streak.findOne({ userId });
    const nextState = calculateNextStreakState({ existingStreak: streak, today: new Date() });

    if (nextState.shouldCreate) {
      await Streak.create({
        userId,
        currentStreak: nextState.currentStreak,
        longestStreak: nextState.longestStreak,
        lastActiveDate: nextState.lastActiveDate
      });
      return;
    }

    if (!nextState.changed) {
      return;
    }

    streak.currentStreak = nextState.currentStreak;
    streak.longestStreak = nextState.longestStreak;
    streak.lastActiveDate = nextState.lastActiveDate;

    await streak.save();
  } catch (error) {
    console.error("Error updating streak:", error);
  }
};

module.exports = updateStreak;
