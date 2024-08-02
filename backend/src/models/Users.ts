// models/User.ts
import db from "../database/db";
import bcrypt from "bcryptjs";
import { BaseModel } from "./base";

class UserModel extends BaseModel {
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
    if (newUser.password) {
      newUser.password = await bcrypt.hash(newUser.password, 10);
    }
    const [savedUser] = await db("users").insert(newUser).returning("*");
    return savedUser;
  }

  static async update(id: number, user: any) {
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

  static async delete(id: number) {
    await db("users").where({ id }).del();
  }
}

export default UserModel;
