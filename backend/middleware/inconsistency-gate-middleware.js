const User = require('../models/user-model');

const allowedBlockedSessionPaths = new Set([
  '/api/inconsistency-reason',
  '/api/inconsistency-reason/submit-reason',
  '/api/auth/logout'
]);

const inconsistencyGateMiddleware = async (req, res, next) => {
  try {
    if (allowedBlockedSessionPaths.has(req.originalUrl.split('?')[0])) {
      return next();
    }

    const currentUser = await User.findById(req.user.id).select('needsInconsistencyReason inconsistencyGapDays');

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (currentUser.needsInconsistencyReason) {
      return res.status(423).json({
        success: false,
        message: 'Please submit your inconsistency reason before continuing.',
        needsInconsistencyReason: true,
        gapDays: currentUser.inconsistencyGapDays || 0
      });
    }

    return next();
  } catch (error) {
    console.error('error while checking inconsistency gate', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to validate your session state.'
    });
  }
};

module.exports = inconsistencyGateMiddleware;
