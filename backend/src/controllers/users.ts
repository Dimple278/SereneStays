// src/controllers/UserController.ts
import { Request, Response, NextFunction } from "express";
import * as UserService from "../services/users";
import { IUser } from "../interface/user";
import { AuthRequest } from "../interface/auth.interface";

/**
 * Get all users
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await UserService.getAllUsers();
  res.json(users);
};

/**
 * Get a user by ID
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = await UserService.getUserById(parseInt(id, 10));
  res.json(user);
};

/**
 * Create a new user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newUserData: IUser = {
    ...req.body,
    image: req.file?.path || null, // Add image path
  };

  const createdUser = await UserService.createUser(newUserData);
  res.status(201).json(createdUser);
};

/**
 * Update an existing user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const updatedUserData: IUser = {
    ...req.body,
    image: req.file?.path || undefined,
  };

  const updatedUser = await UserService.updateUser(
    parseInt(id, 10),
    updatedUserData
  );
  res.json(updatedUser);
};

/**
 * Delete a user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  await UserService.deleteUser(parseInt(id, 10));
  res.status(204).send();
};

/**
 * Get the current user by token
 * @param {AuthRequest} req
 * @param {Response} res
 */
export const getUserByToken = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const user = await UserService.getUserByToken(userId);
  const { password, ...userData } = user; // Exclude sensitive fields
  res.json(userData);
};
