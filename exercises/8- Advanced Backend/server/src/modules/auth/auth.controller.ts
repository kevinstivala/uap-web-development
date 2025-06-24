import { CreateUserRequest } from './auth.dto';
import { Request, Response } from "express";
import { AuthService } from "./auth.service";


export class AuthController {
    constructor(private authService: AuthService) {}

    register = async (req: Request, res: Response) => {
        try {
            const userData: CreateUserRequest = req.body;
            if (!userData.username) {
                return res.status(400).json({ error: "Username is required" });
            }
            if (!userData.password) {
                return res.status(400).json({ error: "Password is required" });
            }
            const user = await this.authService.register(userData);
            res.status(201).json(user);
        } catch(error) {
            console.error("Error during registration:", error);
            res.status(500).json({ error: "Failed to create user" });
        };
    };

    login = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;
            console.log(username, password);
            if (!username || !password) {
                return res.status(400).json({ error: "Username and password are required" });
            }
            const token = await this.authService.login(username, password);
            res.cookie("authToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                signed: true, // Sign the cookie
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
            res.json({ message: "Login successful", token });
        } catch(error) {
            console.error("Error during login:", error);
            res.status(401).json({ error: "Failed to login" });
        };
    };

    logout = async (req: Request, res: Response) => {
        try {
            res.clearCookie("authToken");
            res.json({ message: "Logout successful" });
        } catch(error) {};
    };

};