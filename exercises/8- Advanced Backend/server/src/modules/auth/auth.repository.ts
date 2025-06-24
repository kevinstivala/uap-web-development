import { database } from "./../../db/connection";
import { User } from "../../types/server";
import { CreateUserRequest } from "./auth.dto";
import { v4 as uuidv4 } from "uuid";

export class AuthRepository {
  async getAllUsers(): Promise<User[]> {
    return database.all<User>("SELECT * FROM users");
  }
  async getUserById(id: string): Promise<User | undefined> {
    return database.get<User>("SELECT * FROM users WHERE id = ?", [id]);
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return database.get<User>("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
  }
  async createUser(userData: CreateUserRequest): Promise<User> {
    const id = uuidv4(); // Generate a unique ID for the user
    await database.run(
      "INSERT INTO users (id, email, password) VALUES (?, ?, ?)",
      [id, userData.username, userData.password]
    );
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("Failed to create user");
    }
    return user; // Return the created user
  }
  async deleteUser(id: string): Promise<boolean> {
    await database.run("DELETE FROM users WHERE id = ?", [id]);
    return true;
  }
  async userExists(id: string): Promise<boolean> {
    const user = await this.getUserById(id);
    return !!user;
  }
}
