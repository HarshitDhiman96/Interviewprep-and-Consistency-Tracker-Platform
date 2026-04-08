const log = require('../models/logs-model')
const updateStreak=require("../utils/streak-utils")

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

        await updateStreak(userID);
        // console.log("Calling updateStreak for:", userID);

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
        const date = new Date(req.body.date);
        const userID=req.user.id;
        const start = new Date(date.setHours(0, 0, 0, 0));
        const end = new Date(date.setHours(23, 59, 59, 999));

        const dailylog = await log.find({
            user: userID,
            createdAt: { $gte: start, $lte: end }
        });
        if (dailylog.length === 0) {
            return res.status(400).json({
                message: "no log found ",
                status: false
            })
        }
        res.status(200).json({
            data: dailylog
        })
    } catch (e) {
        res.status(400).json({
            message: "error while fetching daily log"
        })
        console.log(e)
    }
}
const weeklog = async (req, res) => {
    try {

        const userID = req.user.id;

        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);

        startDate.setHours(0,0,0,0);
        endDate.setHours(23,59,59,999);

        const logs = await log.find({
            user: userID,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ createdAt: -1 });

        if (logs.length === 0) {
            return res.status(404).json({
                message: "No logs found for this week"
            });
        }

        return res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Error fetching weekly logs"
        });

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

const getalllogs = async (req, res) => {
    try {
        const userID = req.user.id;
        const allLogs = await log.find({ user: userID }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: allLogs });
    } catch (e) {
        return res.status(500).json({ message: "error fetching all logs", success: false });
    }
};

module.exports = { addlog, dailylog, weeklog, filterbyskills, getalllogs }