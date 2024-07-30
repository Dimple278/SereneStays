import { Request, Response, NextFunction } from "express";
import UserModel from "../models/Users";
import { NotFoundError, BadRequestError } from "../error/Error";
import { cloudinary } from "../../cloudinary";
import { AuthRequest } from "../interface/auth.interface";

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
  const { email, ...body } = req.body;
  const { file } = req;
  console.log(req);
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);

  // Check if email already exists for another user
  if (email) {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser && existingUser.id !== parseInt(id)) {
      throw new BadRequestError("Email already in use");
    }
  }

  // Process uploaded image
  let updatedImage;
  if (file) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "airbnb",
    });
    updatedImage = result.secure_url;
  }

  // Build the update object
  const updatedUser: any = { ...body };
  if (email) updatedUser.email = email;
  if (updatedImage) updatedUser.image = updatedImage;

  // Check if there's something to update
  if (Object.keys(updatedUser).length === 0) {
    throw new BadRequestError("No data to update");
  }

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

// Get the current user by token
export const getUserByToken = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id; // Using req.user from authentication middleware
    console.log("User ID:", userId);
    console.log("User:", req.user);
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude sensitive fields
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
