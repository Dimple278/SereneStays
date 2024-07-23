// models/User.ts
import db from "../db";
import bcrypt from "bcryptjs";

class UserModel {
  static async findByEmail(email: string) {
    const user = await db("users").where({ email }).first();
    return user;
  }
  static async findAll() {
    const users = await db("users").select("*");
    return users;
  }

  static async findById(id: number) {
    const user = await db("users").where({ id }).first();
    return user;
  }

  static async save(user: any) {
    const newUser = { ...user };
    const [savedUser] = await db("users").insert(newUser).returning("*");
    return savedUser;
  }

  static async update(id: number, user: any) {
    const updatedUser = await db("users")
      .where({ id })
      .update(user)
      .returning("*");
    return updatedUser[0];
  }

  static async delete(id: number) {
    await db("users").where({ id }).del();
  }
}

export default UserModel;
