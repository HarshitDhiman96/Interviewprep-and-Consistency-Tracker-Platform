const Heatmap = require('../models/heatmap-model');

const saveClick = async (req, res) => {
  try {
    const { clicks } = req.body;
    // user is optional, may not be logged in
    const user = req.user ? req.user.id : null; 

    if (!Array.isArray(clicks) || clicks.length === 0) {
      return res.status(400).json({ success: false, message: 'No clicks provided' });
    }

    const payload = clicks.map(c => ({
      ...c,
      user
    }));

    await Heatmap.insertMany(payload);

    return res.status(200).json({ success: true, message: 'Clicks logged' });
  } catch (error) {
    console.error('Heatmap Save Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getHeatmap = async (req, res) => {
  try {
    const { route } = req.query;
    if (!route) {
      return res.status(400).json({ success: false, message: 'Route query parameter is required' });
    }

    const clicks = await Heatmap.find({ route });

    return res.status(200).json({ success: true, data: clicks });
  } catch (error) {
    console.error('Heatmap Get Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { saveClick, getHeatmap };
