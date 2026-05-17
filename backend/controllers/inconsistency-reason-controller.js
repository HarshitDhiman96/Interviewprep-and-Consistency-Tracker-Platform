// Jab user ka streak break hota hai aur gap 2 din se zyada hota hai,
// tab frontend user se reason leta hai. Ye controller wahi reason save karta hai.
// Reason minimum 10 characters ka hona chahiye, tag allowed list me hona chahiye,
// aur gapDays valid number hona chahiye.
// Reason save hone ke baad user ka needsInconsistencyReason false kar dete hain,
// taaki popup baar baar na aaye. Saath me recent 5 reasons bhi bhejte hain.

const InconsistencyReason = require('../models/inconsistency-reason-model');
const User = require('../models/user-model');

const allowedTags = new Set(['burnout', 'distraction', 'no plan', 'health', 'other', '']);

const submitInconsistencyReason = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reason, tag = '', gapDays } = req.body;

    const trimmedReason = typeof reason === 'string' ? reason.trim() : '';
    const normalizedTag = typeof tag === 'string' ? tag.trim().toLowerCase() : '';
    const normalizedGapDays = Number(gapDays);

    if (trimmedReason.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please share at least 10 characters about what happened.'
      });
    }

    if (!allowedTags.has(normalizedTag)) {
      return res.status(400).json({
        success: false,
        message: 'Please choose a valid reason tag.'
      });
    }

    if (!Number.isFinite(normalizedGapDays) || normalizedGapDays < 0) {
      return res.status(400).json({
        success: false,
        message: 'gapDays must be a valid non-negative number.'
      });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!currentUser.needsInconsistencyReason) {
      return res.status(409).json({
        success: false,
        message: 'This inconsistency reason has already been submitted.'
      });
    }

    const savedReason = await InconsistencyReason.create({
      userId,
      reason: trimmedReason,
      tag: normalizedTag,
      gapDays: normalizedGapDays
    });

    currentUser.needsInconsistencyReason = false;
    currentUser.inconsistencyGapDays = 0;
    await currentUser.save();

    const recentReasons = await InconsistencyReason.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(201).json({
      success: true,
      message: 'Thanks for sharing. You can continue now.',
      reason: savedReason,
      needsInconsistencyReason: false,
      recentReasons
    });
  } catch (error) {
    console.error('error while saving inconsistency reason', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to save your reason right now.'
    });
  }
};

module.exports = {
  submitInconsistencyReason
};
