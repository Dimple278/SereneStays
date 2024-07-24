import { Request, Response, NextFunction } from "express";
import UserModel from "../models/Users";

import { NotFoundError } from "../error/Error";

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
  const newUser = await UserModel.save(req.body);
  res.status(201).json(newUser);
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const updatedUser = await UserModel.update(parseInt(id), req.body);
  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }
  res.json(updatedUser);
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
