import { Router } from "express";
import { AuthRepository } from "../modules/auth/auth.repository";
import { AuthService } from "../modules/auth/auth.service";
import { AuthController } from "../modules/auth/auth.controller";

const router = Router();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export {router as authRoutes};