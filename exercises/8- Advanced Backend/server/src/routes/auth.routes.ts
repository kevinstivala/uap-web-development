import { NextFunction, Router, Request, Response } from "express";
import { AuthRepository } from "../modules/auth/auth.repository";
import { AuthService } from "../modules/auth/auth.service";
import { AuthController } from "../modules/auth/auth.controller";
import { body, validationResult } from "express-validator";
import { authMiddlewareCookies } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/error.middleware";

const router = Router();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

// Validaciones para registro y login
const usernameValidation = body("username")
  .isString()
  .withMessage("El nombre de usuario debe ser texto.")
  .isLength({ min: 3, max: 20 })
  .withMessage("El nombre de usuario debe tener entre 3 y 20 caracteres.")
  .trim()
  .escape();

const passwordValidation = body("password")
  .isString()
  .withMessage("La contraseña debe ser texto.")
  .isLength({ min: 3 })
  .withMessage("La contraseña debe tener al menos 3 caracteres.");

// Middleware para devolver mensajes claros de validación
function handleValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Devuelve el primer mensaje de error encontrado
    return res.status(400).json({
      error: errors.array()[0].msg,
      details: errors.array(),
    });
  }
  next();
}

router.post(
  "/register",
  authRateLimiter,
  [usernameValidation, passwordValidation, handleValidationErrors],
  authController.register
);
router.post(
  "/login",
  authRateLimiter,
  [usernameValidation, passwordValidation, handleValidationErrors],
  authController.login
);
router.post("/logout", authController.logout);
router.get("/user", authMiddlewareCookies, authController.getUser);
router.get("/list", authMiddlewareCookies, authController.getAllUsers);

export { router as authRoutes };
