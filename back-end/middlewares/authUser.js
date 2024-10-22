import User from "../models/User.js";

import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
    try {

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }
        const user = await User.findOne({ email: decoded.email }).select("-password");
        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};