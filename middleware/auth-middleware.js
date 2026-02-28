const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    //   console.log(authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided please login first" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.jwtkey);

    req.user = {
        id: decoded.userid
    };

    // console.log("Decoded token:", decoded);
    // console.log("req.user:", req.user);


    next();
};

module.exports = authMiddleware;
