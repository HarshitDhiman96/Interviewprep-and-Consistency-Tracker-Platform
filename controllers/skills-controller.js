const user = require('../models/user-model')

const addskill = async (req, res) => {
    try {
        const userID = req.user.id;
        const userdata = await user.findById(userID);
        // console.log("userid",userID);
        // console.log("userdata",userdata);
        const { newskillname } = req.body;
        // console.log("newskillsname",newskillname)

        if (!newskillname) {
            return res.status(400).json({
                success: false,
                message: "Skill name is required"
            });
        }
        else {
            // console.log("skills of user based on unique id",userdata.skills)
            userdata.skills.push({
                name: newskillname.trim(),
                active: true
            });
            await userdata.save();
            res.status(200).json({
                message: "added new skill",
                success: true,
                newskill: userdata.skills
            })
        }
    }
    catch (e) {
        res.status(400).json({
            message: "error while adding skills of user",
            success: false
        })
        console.log(e)
    }
}
const fetchskill = async (req, res) => {
    try {
        const userID = req.user.id;
        const userdata = await user.findById(userID).select("skills");
        res.status(200).json({
            message: "skills found",
            skills: userdata.skills.filter(skills => skills.active),
            success: true
        })
    } catch (e) {
        res.status(400).json({
            message: "error while fetching skills of user",
            success: false
        })
    }
}
const deleteskill = async (req, res) => {
    try {
        const userID = req.user.id;
        const { skillId } = req.params;
        console.log('skillsid:', skillId)

        const userdata = await user.findById(userID);

        if (!userdata) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        userdata.skills = userdata.skills.filter(
            skills => skills._id.toString() !== skillId
        );
        await userdata.save();

        res.status(200).json({
            success: true,
            message: "Skill deleted successfully",
            skills: userdata.skills
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error deleting skill"
        });
    }
};

module.exports = { addskill, deleteskill, fetchskill }