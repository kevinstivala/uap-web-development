import { UserPayload } from './../../types/express/server.d';
import {Request, Response} from "express";
import { SettingsService } from './settings.service';

export class SettingsController {
    constructor(private settingsService: SettingsService){}
    getSettings = async (req: Request, res: Response) => {
    const userId = req.user!.userId as UserPayload['userId'];
    const settings = await this.settingsService.getSettings(userId);
    res.json(settings || {refreshInterval: 5000, upperCaseDescription: false, paginationLimit: 5});
}
updateSettings = async (req: Request, res: Response) => {
    const userId = req.user!.userId as UserPayload['userId'];
    const { refreshInterval, upperCaseDescription, paginationLimit } = req.body;
    const updated = await this.settingsService.updateSettings(userId, { refreshInterval, upperCaseDescription, paginationLimit });
    res.json(updated);
}
}