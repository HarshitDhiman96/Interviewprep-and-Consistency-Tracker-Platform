const log = require('../models/logs-model')

const addlog = async (req, res) => {
    try {
        const { skill, status, topic, difficulty, timespent } = req.body;
        const userID = req.user.id;
        if (!userID) {
            return res.status(400).json({
                message: "user not found please register/login first ",
                success: false
            })
        }
        // console.log(userID);
        const newlog = new log({ user: userID, skill, status, topic, difficulty, timespent });
        // console.log(newlog);
        await newlog.save();
        return res.status(201).json({
            message: "Log added successfully",
            success: true,
            data: newlog
        });

    } catch (e) {
        res.status(400).json({
            message: e.message,
            success: false
        })
    }
}
const dailylog = async (req, res) => {
    try {
        
    } catch (e) {
        res.status(400).json({
            message: "error while fetching daily log",
        })
    }
}
const weeklog = async (req, res) => {
    try {

    } catch (e) {
        res.status(400).json({
            message: "error while fetching weekly log",
        })
    }
}
const filterbyskills = async (req, res) => {
    try {
        const skillname = req.query.skill;
        const userID = req.user.id;

        console.log("skillname user provided is :", skillname);

        if (!userID) {
            return res.status(401).json({
                message: "please login first to access logs"
            });
        }

        if (!skillname) {
            return res.status(400).json({
                message: "Skill is required"
            });
        }

        const skilllog = await log.find({ 
            skill: skillname, 
            user: userID 
        });

        if (skilllog.length === 0) {
            return res.status(404).json({
                message: "log not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: skilllog
        });

    } catch (e) {
        return res.status(500).json({
            message: "error while fetching logs based on skills",
        });
    }
};

module.exports = { addlog, dailylog, weeklog, filterbyskills }