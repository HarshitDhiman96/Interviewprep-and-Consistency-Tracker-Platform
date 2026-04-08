const Revision =require("../models/revision-model");
const mongoose=require("mongoose");


 const addRevision = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skill, topic } = req.body;

    let revision = await Revision.findOne({
      user: userId,
      skill,
      topic
    });

    // If already exists → increment
    if (revision) {
      revision.revisionCount += 1;
      revision.lastRevisedAt = new Date();
      await revision.save();
    } 
    // First revision
    else {
      revision = await Revision.create({
        user: userId,
        skill,
        topic
      });
    }

    return res.status(200).json({
      success: true,
      message: "Revision updated",
      revision
    });

  } catch (error) {
    console.error("Error in revision:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update revision"
    });
  }
};
 const getRevisions = async (req, res) => {
  try {
    const userId = req.user.id;

    const revisions = await Revision.find({ user: userId })
      .sort({ revisionCount: -1 });

    return res.status(200).json({
      success: true,
      data: revisions
    });

  } catch (error) {
    console.error("Error fetching revisions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch revisions"
    });
  }
};

const deleteRevision = async (req, res) => {
  try {
    const userId = req.user.id;
    const { revisionId } = req.params;

    const deletedRevision = await Revision.findOneAndDelete({
      _id: revisionId,
      user: userId,
    });

    if (!deletedRevision) {
      return res.status(404).json({
        success: false,
        message: 'Revision topic not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Revision removed from the queue',
      revision: deletedRevision,
    });
  } catch (error) {
    console.error('Error deleting revision:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove revision',
    });
  }
};

module.exports={addRevision,getRevisions,deleteRevision};
