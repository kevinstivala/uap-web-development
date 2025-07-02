import { CreateUserRequest } from "./auth.dto";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    try {
      const userData: CreateUserRequest = req.body;
      if (!userData.username) {
        return res
          .status(400)
          .json({ error: "El nombre de usuario es requerido." });
      }
      if (!userData.password) {
        return res.status(400).json({ error: "La contraseña es requerida." });
      }
      try {
        const user = await this.authService.register(userData);
        res.status(201).json(user);
      } catch (error: any) {
        if (
          error.code === "SQLITE_CONSTRAINT" ||
          error.message?.includes("UNIQUE") ||
          error.code === "USERNAME_EXISTS"
        ) {
          return res
            .status(409)
            .json({ error: "El nombre de usuario ya existe." });
        }
        throw error;
      }
    } catch (error: any) {
      console.error("Error durante el registro:", error);
      res.status(500).json({ error: "Error interno al crear el usuario." });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      console.log(username, password);
      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }
      const token = await this.authService.login(username, password);
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        signed: true, // Sign the cookie
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      res.json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(401).json({ error: "Failed to login" });
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("authToken");
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ error: "Failed to logout" });
    }
  };

  getUser = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const user = await this.authService.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user); // Solo id y username
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Failed to retrieve user" });
    }
  };
}
