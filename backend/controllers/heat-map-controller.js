// Ye controller frontend clicks ko heatmap ke liye save karta hai.
// User login ho ya na ho, clicks save ho sakte hain; login user ho to user id bhi attach hoti hai.
// saveClick multiple clicks ek saath database me insert karta hai.
// getHeatmap kisi specific route/page ke saved clicks fetch karta hai,
// taaki frontend/admin dekh sake user page par kaha click kar rahe hain.

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
