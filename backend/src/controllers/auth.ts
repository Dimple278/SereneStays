import { Request, Response } from "express";
import UserModel from "../models/Users";
import bcrypt from "bcrypt";
import jwt, { verify } from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";

import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../error/Error";
import config from "../config";
import { IUser } from "../interface/user";

// Signup handler
export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new BadRequestError("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModel.save({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ message: "User created successfully" });
};

// Login handler
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError("Invalid email or password");
  }
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  res.status(200).json({ accessToken, refreshToken });
};

// Refresh token handler
export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    const decoded = verify(refreshToken, config.jwt.secret!) as Pick<
      IUser,
      "id" | "name" | "email"
    >;

    const payload = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };

    const newAccessToken = await generateAccessToken(payload);
    const newRefreshToken = await generateRefreshToken(payload);

    res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error(error);
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new BadRequestError("Invalid token");
    }
    throw new InternalServerError("Could not authenticate");
  }
}
