import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/Users";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  req.session.userId = user.id;
  res.json({ message: "Login successful" });
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await UserModel.findById(req.session.userId);
  res.json(user);
};
