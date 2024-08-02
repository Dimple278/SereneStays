// src/services/UserService.ts
import UserModel from "../models/Users";
import { IUser } from "../interface/user";
import { cloudinary } from "../../cloudinary";
import { NotFoundError } from "../error/NotFoundError";
import { BadRequestError } from "../error/BadRequestError";

/**
 * Get all users
 * @returns {Promise<IUser[]>}
 */
export const getAllUsers = async (
  page: number,
  limit: number
): Promise<{ users: IUser[]; totalCount: number }> => {
  return await UserModel.findAll(page, limit);
};

/**
 * Get a user by ID
 * @param {number} id - User ID
 * @returns {Promise<IUser>}
 * @throws {NotFoundError} - If user is not found
 */
export const getUserById = async (id: number): Promise<IUser> => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

/**
 * Create a new user
 * @param {IUser} userData - Data for the new user
 * @returns {Promise<IUser>}
 * @throws {BadRequestError} - If email is already in use
 */
export const createUser = async (userData: IUser): Promise<IUser> => {
  const existingUser = await UserModel.findByEmail(userData.email);
  if (existingUser) {
    throw new BadRequestError("Email already in use");
  }
  return await UserModel.save(userData);
};

/**
 * Update an existing user
 * @param {number} id - User ID
 * @param {IUser} userData - Data to update the user
 * @returns {Promise<IUser>}
 * @throws {NotFoundError} - If user is not found
 */
export const updateUser = async (
  id: number,
  userData: IUser
): Promise<IUser> => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Check if email already exists for another user
  if (userData.email) {
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser && existingUser.id !== id) {
      throw new BadRequestError("Email already in use");
    }
  }

  // Process uploaded image
  if (userData.image) {
    const result = await cloudinary.uploader.upload(userData.image, {
      folder: "airbnb",
    });
    userData.image = result.secure_url;
  }

  return await UserModel.update(id, userData);
};

/**
 * Delete a user
 * @param {number} id - User ID
 * @returns {Promise<void>}
 * @throws {NotFoundError} - If user is not found
 */
export const deleteUser = async (id: number): Promise<void> => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  await UserModel.delete(id);
};

/**
 * Get the current user by token
 * @param {number} userId - User ID from token
 * @returns {Promise<IUser>}
 * @throws {NotFoundError} - If user is not found
 */
export const getUserByToken = async (userId: number): Promise<IUser> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};
