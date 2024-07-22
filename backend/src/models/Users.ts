// // models/User.ts
// import db from "../db";

// interface User {
//   id?: number;
//   email: string;
//   fName: string;
//   lName?: string;
//   providerId?: string;
//   provider?: string;
//   image?: { url: string; filename: string };
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// class UserModel {
//   static async findAll() {
//     return db("users").select("*");
//   }

//   static async findById(id: number) {
//     return db("users").where({ id }).first();
//   }

//   static async findByEmail(email: string) {
//     return db("users").where({ email }).first();
//   }

//   static async save(user: User) {
//     const [newUser] = await db("users").insert(user).returning("*");
//     return newUser;
//   }

//   static async update(id: number, user: User) {
//     const [updatedUser] = await db("users")
//       .where({ id })
//       .update(user)
//       .returning("*");
//     return updatedUser;
//   }

//   static async delete(id: number) {
//     return db("users").where({ id }).del();
//   }
// }

// export default UserModel;

import db from "../db";

interface User {
  id?: number;
  email: string;
  fName: string;
  lName?: string;
  providerId?: string;
  provider?: string;
  image?: { url: string; filename: string };
  createdAt?: Date;
  updatedAt?: Date;
}

class UserModel {
  private tableName: string = "users";

  public async create(user: User): Promise<User> {
    const [newListing] = await db(this.tableName).insert(user).returning("*");
    return newListing;
  }

  public async save(user: User): Promise<User> {
    return await this.create(user);
  }

  public async findAll(): Promise<User[]> {
    return await db(this.tableName).select("*");
  }

  public async findById(id: number): Promise<User | undefined> {
    return await db(this.tableName).where({ id }).first();
  }

  public async update(id: number, listing: Partial<User>): Promise<User> {
    const [updatedUser] = await db(this.tableName)
      .where({ id })
      .update(listing)
      .returning("*");
    return updatedUser;
  }

  public async delete(id: number): Promise<void> {
    await db(this.tableName).where({ id }).del();
  }
}

export default new UserModel();
