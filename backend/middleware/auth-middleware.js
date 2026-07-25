const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // const token =
    // req.cookies.token ||
    // (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    const token =
        (req.headers.authorization &&
            req.headers.authorization.split(" ")[1]) ||
        req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token, please login first" });
    }
    // console.log("AUTH MIDDLEWARE HIT");
    // console.log("Authorization:", req.headers.authorization);
    // console.log("Cookie token:", req.cookies?.token);
    // console.log("Selected token:", token);

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