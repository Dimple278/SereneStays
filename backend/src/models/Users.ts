import db from "../database/db";
import bcrypt from "bcryptjs";
import { BaseModel } from "./base";

class UserModel extends BaseModel {
  /**
   * Retrieves a user by their email address.
   * @param {string} email - The email address of the user to retrieve.
   * @returns {Promise<any | undefined>} A promise that resolves to the user, or undefined if not found.
   */
  static async findByEmail(email: string): Promise<any | undefined> {
    const user = await db("users").where({ email }).first();
    return user;
  }

  /**
   * Retrieves all users with pagination.
   * @param {number} page - The page number to retrieve.
   * @param {number} limit - The number of users per page.
   * @returns {Promise<{ users: any[], totalCount: number }>} A promise that resolves to an object containing an array of users and the total count of users.
   */
  static async findAll(
    page: number,
    limit: number
  ): Promise<{ users: any[]; totalCount: number }> {
    const users = await db("users")
      .select("*")
      .offset((page - 1) * limit)
      .limit(limit);
    const [{ count }] = await db("users").count("id as count");
    return { users, totalCount: parseInt(String(count), 10) };
  }

  /**
   * Retrieves a user by their ID.
   * @param {number} id - The ID of the user to retrieve.
   * @returns {Promise<any | undefined>} A promise that resolves to the user, or undefined if not found.
   */
  static async findById(id: number): Promise<any | undefined> {
    const user = await db("users").where({ id }).first();
    return user;
  }

  /**
   * Saves a new user to the database. Hashes the user's password if provided.
   * @param {any} user - The user data to save.
   * @returns {Promise<any>} A promise that resolves to the newly created user.
   */
  static async save(user: any): Promise<any> {
    const newUser = { ...user };
    if (newUser.password) {
      newUser.password = await bcrypt.hash(newUser.password, 10);
    }
    const [savedUser] = await db("users").insert(newUser).returning("*");
    return savedUser;
  }

  /**
   * Updates an existing user in the database. Hashes the new password if provided.
   * @param {number} id - The ID of the user to update.
   * @param {any} user - The updated user data.
   * @returns {Promise<any>} A promise that resolves to the updated user.
   */
  static async update(id: number, user: any): Promise<any> {
    const updatedUser = { ...user };
    if (updatedUser.password) {
      updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
    }
    const [result] = await db("users")
      .where({ id })
      .update(updatedUser)
      .returning("*");
    return result;
  }

  /**
   * Deletes a user from the database.
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<void>} A promise that resolves when the user has been deleted.
   */
  static async delete(id: number): Promise<void> {
    await db("users").where({ id }).del();
  }
}

export default UserModel;
