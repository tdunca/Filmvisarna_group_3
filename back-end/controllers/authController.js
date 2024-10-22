import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const userRegister = async (req, res) => {
    try {
      const { email, password, firstName, lastName, role } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword, firstName, lastName, role: role || "user" });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

export const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "User does not exist" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid password" });
      }
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
      if (!token) {
        return res.status(500).json({ error: "Failed to generate token" });
      }
      res.cookie("token", token, { httpOnly: true });
      const { password: _, ...userWithoutPassword } = user.toObject();
      res.status(200).json({ message: "User logged in successfully", user: userWithoutPassword });
      } catch (error) {
      res.status(500).json({ error: "Server error" });
      }
  }

  export const userLogout = (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: `Server Error ${error.message}` });

    }
}

export const resetPassword = async (req, res) => {
    try {
        const { username, oldPassword, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid old password" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}