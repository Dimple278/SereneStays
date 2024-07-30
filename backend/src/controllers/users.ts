import { Request, Response, NextFunction } from "express";
import UserModel from "../models/Users";
import { NotFoundError, BadRequestError } from "../error/Error";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await UserModel.findAll();
  res.json(users);
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = await UserModel.findById(parseInt(id));
  if (!user) {
    throw new NotFoundError("User not found");
  }
  res.json(user);
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new BadRequestError("Email already in use");
  }

  const newUser = {
    ...req.body,
    image: req.file?.path || null, // Add image path
  };

  const createdUser = await UserModel.save(newUser);
  res.status(201).json(createdUser);
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { email } = req.body;

  const existingUser = await UserModel.findByEmail(email);
  if (existingUser && existingUser.id !== parseInt(id)) {
    throw new BadRequestError("Email already in use");
  }

  const updatedUser = {
    ...req.body,
    image: req.file?.path || req.body.image, // Update image path if a new file is uploaded
  };

  const user = await UserModel.update(parseInt(id), updatedUser);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  res.json(user);
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  await UserModel.delete(parseInt(id));
  res.status(204).send();
};
