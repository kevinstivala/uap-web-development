import { NextFunction, Router, Request, Response } from 'express';
import { SettingsRepository } from '../modules/settings/settings.repository';
import { SettingsService } from '../modules/settings/settings.service';
import { SettingsController } from '../modules/settings/settings.controller';
import { authMiddlewareCookies } from './../middleware/auth.middleware';
import {body, validationResult} from "express-validator";

const router = Router();
const settingsRepository = new SettingsRepository();
const settingsService = new SettingsService(settingsRepository);
const settingsController = new SettingsController(settingsService);

router.get("/settings", authMiddlewareCookies, settingsController.getSettings);
router.put(
  "/settings",
  authMiddlewareCookies,
  [
    body("refreshInterval").optional().isInt({ min: 10, max: 3600 }),
    body("viewMode").optional().isIn(["list", "kanban"]),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validación fallida", details: errors.array() });
    }
    next();
  },
  settingsController.updateSettings
);

export  {router as settingsRoutes};
