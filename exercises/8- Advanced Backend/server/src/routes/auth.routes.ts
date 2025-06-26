import { NextFunction, Router, Request, Response } from "express";
import { AuthRepository } from "../modules/auth/auth.repository";
import { AuthService } from "../modules/auth/auth.service";
import { AuthController } from "../modules/auth/auth.controller";
import { body, validationResult } from "express-validator";

const router = Router();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post(
  "/register",
  [
    body("username").isString().isLength({ min: 3, max: 20 }).trim().escape(),
    body("password")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Password mínimo 3 caracteres"),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validación fallida", details: errors.array() });
    }
    next();
  },
  authController.register
);
router.post(
  "/login",
  [
    body("username").isString().isLength({ min: 3, max: 20 }).trim().escape(),
    body("password")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Password mínimo 3 caracteres"),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Validación fallida", details: errors.array() });
    }
    next();
  },
  authController.login
);
router.post("/logout", authController.logout);

export { router as authRoutes };
