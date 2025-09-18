import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client, UserRefreshClient } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const handleGoogleAuth = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "No auth code received" });
    }

    const { tokens } = await oAuth2Client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    oAuth2Client.setCredentials(tokens);

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "",
      });
    }

    const jwtToken = generateToken(user._id);

    res.status(200).json({
      message:
        user.createdAt === user.updatedAt
          ? "Registered via Google"
          : "Logged in via Google",
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Google Auth Error (full):", err);
    res
      .status(400)
      .json({ message: "Google authentication failed", error: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
