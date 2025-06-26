import { UserPayload } from './../../types/express/server.d';
import {Request, Response} from "express";
import { SettingsService } from './settings.service';

export class SettingsController {
    constructor(private settingsService: SettingsService){}
    getSettings = async (req: Request, res: Response) => {
        const userId = req.user!.id as UserPayload['userId'];
        const settings = await this.settingsService.getSettings(userId);
        res.json(settings || {refreshInterval: 10, viewMode: "list"});
    }
    updateSettings = async (req: Request, res: Response) => {
        const userId = req.user!.id as UserPayload['userId'];
        const { refreshInterval, viewMode } = req.body;
        const updated = await this.settingsService.updateSettings(userId, { refreshInterval, viewMode });
        res.json(updated);
    }
}