const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
        return res.status(401).json({ message: "No token, please login first" });
    }

    try {
        const decoded = jwt.verify(token, process.env.jwtkey);

        req.user = {
            id: decoded.userid
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;