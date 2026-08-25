const Revision = require('../models/revision-model');
const Log = require('../models/logs-model');
const { getNormalizedProblemName, getDefaultReviewWindow, getNextIntervalForResult, addDays } = require('../utils/dsa-revision-utils');

const normalizeDsaLogInput = (payload = {}) => {
  const skill = (payload.skill || '').trim();
  const problemName = (payload.problemName || payload.topic || '').trim();
  const topic = (payload.topic || '').trim();
  const difficulty = (payload.difficulty || 'medium').toLowerCase();
  const result = payload.result || '';
  const timeSpent = Number(payload.timespent ?? payload.timeSpent ?? 0);

  return {
    skill,
    problemName,
    topic,
    difficulty,
    result,
    timeSpent,
  };
};

const ensureDsaRevision = async ({ userId, skill, problemName, topic, difficulty, result, timeSpent, logId, attemptNumber }) => {
  if (!userId || skill !== 'DSA' || !problemName) {
    return null;
  }

  const normalizedProblemName = getNormalizedProblemName(problemName);

  let revision = await Revision.findOne({
    user: userId,
    skill: 'DSA',
    normalizedProblemName,
  });

  const now = new Date();

  if (!revision) {
    const initialInterval = result === 'solved_independently' ? 0 : 1;
    const nextReviewAt = result === 'solved_independently' ? null : getDefaultReviewWindow(result, initialInterval);

    revision = await Revision.create({
      user: userId,
      skill: 'DSA',
      problemName,
      normalizedProblemName,
      topic,
      difficulty,
      status: result === 'solved_independently' ? 'active' : 'needs_revision',
      firstAttemptAt: now,
      lastAttemptAt: now,
      nextReviewAt: nextReviewAt || null,
      reviewCount: 0,
      currentInterval: initialInterval,
      lastResult: result || '',
      createdAt: now,
      updatedAt: now,
    });
  } else {
    revision.problemName = problemName;
    revision.topic = topic || revision.topic;
    revision.difficulty = difficulty || revision.difficulty;
    revision.lastAttemptAt = now;
    revision.updatedAt = now;
  }

  if (result === 'solved_independently') {
    revision.status = 'active';
    revision.reviewCount += 1;
    revision.currentInterval = Math.max(revision.currentInterval || 0, 0);
    revision.lastResult = result;
    revision.nextReviewAt = null;
    revision.updatedAt = now;
  } else {
    revision.status = 'needs_revision';
    revision.reviewCount += 1;
    revision.currentInterval = revision.currentInterval || 1;
    revision.lastResult = result;
    revision.nextReviewAt = getDefaultReviewWindow(result, revision.currentInterval);
    revision.updatedAt = now;
  }

  await revision.save();

  await Log.findByIdAndUpdate(logId, {
    revisionProblemId: revision._id,
    problemName,
    topic,
    difficulty,
    result,
    timeSpent,
    attemptNumber,
    attemptedAt: now,
  });

  return revision;
};

const addDsaLog = async (req, res) => {
  try {
    const payload = normalizeDsaLogInput(req.body);
    const { skill, problemName, difficulty, result, timeSpent, topic } = payload;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Please log in to save a DSA problem.' });
    }

    if (!skill) {
      return res.status(400).json({ success: false, message: 'Please select a skill before creating a log.' });
    }

    if (skill === 'DSA') {
      if (!problemName) {
        return res.status(400).json({ success: false, message: 'Please enter the DSA problem or topic name.' });
      }

      if (!['solved_independently', 'logic_understood', 'needed_solution'].includes(result)) {
        return res.status(400).json({ success: false, message: 'Please choose the result for this DSA attempt.' });
      }
    }

    const existingLogs = await Log.find({ user: userId, skill: 'DSA', problemName: { $regex: new RegExp(`^${problemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }).sort({ attemptedAt: -1, createdAt: -1 });

    const attemptNumber = existingLogs.length > 0 ? (existingLogs[0].attemptNumber || 1) + 1 : 1;

    const log = await Log.create({
      user: userId,
      skill,
      status: result === 'solved_independently' ? 'solved' : 'stuck',
      topic: topic || problemName,
      difficulty,
      timespent: timeSpent || 0,
      reflection: '',
      mood: '',
      problemName,
      result,
      revisionProblemId: null,
      attemptNumber,
      attemptedAt: new Date(),
    });

    const revision = await ensureDsaRevision({
      userId,
      skill,
      problemName,
      topic: topic || problemName,
      difficulty,
      result,
      timeSpent: timeSpent || 0,
      logId: log._id,
      attemptNumber,
    });

    return res.status(201).json({
      success: true,
      message: skill === 'DSA' ? 'DSA attempt saved successfully.' : 'Log added successfully.',
      data: { log, revision },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Unable to save the log.' });
  }
};

const getDueRevisions = async (req, res) => {
  try {
    const userId = req.user?.id;
    const revisions = await Revision.find({
      user: userId,
      skill: 'DSA',
      nextReviewAt: { $lte: new Date() },
      status: 'needs_revision',
    }).sort({ nextReviewAt: 1, lastAttemptAt: -1 });

    return res.status(200).json({ success: true, data: revisions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Unable to load due revisions.' });
  }
};

const getRevisionHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const revisions = await Revision.find({ user: userId, skill: 'DSA' }).sort({ lastAttemptAt: -1 });
    const revisionHistory = await Promise.all(revisions.map(async (item) => {
      const attempts = await Log.find({ user: userId, skill: 'DSA', revisionProblemId: item._id }).sort({ attemptedAt: 1 });
      return { ...item.toObject(), attempts };
    }));

    return res.status(200).json({ success: true, data: revisionHistory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Unable to load revision history.' });
  }
};

const updateRevisionScheduling = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { revisionId, customDays, result } = req.body;

    if (!revisionId) {
      return res.status(400).json({ success: false, message: 'Revision id is required.' });
    }

    const revision = await Revision.findOne({ _id: revisionId, user: userId });
    if (!revision) {
      return res.status(404).json({ success: false, message: 'Revision not found.' });
    }

    const selectedDays = Number(customDays || 0);
    let nextReviewAt = revision.nextReviewAt || new Date();

    if (selectedDays > 0) {
      nextReviewAt = addDays(new Date(), selectedDays);
    } else if (result && ['solved_independently', 'logic_understood', 'needed_solution'].includes(result)) {
      nextReviewAt = addDays(new Date(), getNextIntervalForResult(result, revision.currentInterval || 0));
    }

    revision.nextReviewAt = nextReviewAt;
    revision.status = 'needs_revision';
    revision.updatedAt = new Date();
    await revision.save();

    return res.status(200).json({ success: true, data: revision });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Unable to update revision schedule.' });
  }
};

module.exports = {
  addDsaLog,
  getDueRevisions,
  getRevisionHistory,
  updateRevisionScheduling,
};
