const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    var token = req.cookies.auth;
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, "secretKey");
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = { verifyToken };