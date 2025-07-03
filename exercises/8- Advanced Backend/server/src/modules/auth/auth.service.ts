import { UserPayload } from "./../../types/express/server.d";
import { User } from "../../types/server";
import { CreateUserRequest } from "./auth.dto";
import { AuthRepository } from "./auth.repository";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async register(userData: CreateUserRequest): Promise<User> {
    const existingUser = await this.authRepository.getUserByUsername(
      userData.username
    );
    if (existingUser) {
      const err: any = new Error("El nombre de usuario ya existe.");
      err.code = "USERNAME_EXISTS";
      throw err;
    }
    const password = userData.password;
    const hashedPassword = await hash(password);
    return this.authRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.authRepository.getUserByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username } as UserPayload,
      process.env.JWT_SECRET!
    );
    return token;
  }

  async getUser(
    userId: string
  ): Promise<{ id: string; username: string } | undefined> {
    const user = await this.authRepository.getUserById(userId);
    if (!user) return undefined;
    return { id: user.id, username: user.username };
  }

  async getAllUsers (): Promise<User[]> {
    return this.authRepository.getAllUsers();
  }
}
