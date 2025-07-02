import { database } from "./../../db/connection";

export class SettingsRepository {
  async getSettings(userId: string) {
    return await database.get("SELECT * FROM user_settings WHERE userId = ?", [
      userId,
    ]);
  }
  async updateSettings(
    userId: string,
    settings: {
      refreshInterval?: number;
      viewMode?: string;
      upperCaseDescription?: boolean;
      paginationLimit?: number;
    }
  ) {
    await database.run(
      `
            INSERT INTO user_settings (userId, refreshInterval, viewMode, upperCaseDescription, paginationLimit)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(userId) DO UPDATE SET
                refreshInterval = excluded.refreshInterval,
                viewMode = excluded.viewMode,
                upperCaseDescription = excluded.upperCaseDescription,
                paginationLimit = excluded.paginationLimit
        `,
      [
        userId,
        settings.refreshInterval ?? 10,
        settings.viewMode ?? "list",
        settings.upperCaseDescription ? 1 : 0,
        settings.paginationLimit ?? 5,
      ]
    );
    return this.getSettings(userId);
  }
}
