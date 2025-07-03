import {SettingsRepository} from "./settings.repository";

export class SettingsService {
    constructor(private settingsRepository: SettingsRepository){}
    async getSettings(userId: string) {
        return this.settingsRepository.getSettings(userId);
    }
    async updateSettings(userId: string, settings: { refreshInterval?: number,  upperCaseDescription?: boolean, paginationLimit?: number }) {
        return this.settingsRepository.updateSettings(userId, settings);
    }
}