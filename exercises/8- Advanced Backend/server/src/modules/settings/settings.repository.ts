import { database } from './../../db/connection';

export class SettingsRepository {
    async getSettings(userId: string) {
        return await database.get("SELECT * FROM user_settings WHERE userId = ?", [userId]);
    }
    async updateSettings(userId: string, settings: { refreshInterval?: number, viewMode?: string }) {
        await database.run(`INSERT INTO user_settings (userId, refreshInterval, viewMode) VALUES (?, ?, ?)
            ON CONFLICT(userId) DO UPDATE SET refeshInterval = excluded.refreshInterval, viewMode = excluded.viewMode `, [userId, settings.refreshInterval ?? 10, settings.viewMode ?? "list"]);
            return this.getSettings(userId);
    }
};