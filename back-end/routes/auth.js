import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  resetPassword,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/authController.js";

const router = express.Router();

// http://localhost:5000/api/auth/logout
// http://localhost:5000/api/auth/register
// http://localhost:5000/api/auth/login

// register a new user
router.post("/register", userRegister);

// login a user
router.post("/login", userLogin);

// logout a user
router.post("/logout", userLogout);

// reset password
router.post("/reset-password", resetPassword);

router.get("/verify-token", async (req, res) => {
  const token = req.query;
  try {
    if (!token) {
      return res.status(401).json({ error: "No authentication token" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ error: "Token verification failed" });
    }

    const user = await User.findById(verified.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
export default router;
