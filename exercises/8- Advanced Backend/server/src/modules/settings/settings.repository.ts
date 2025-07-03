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
      upperCaseDescription?: boolean;
      paginationLimit?: number;
    }
  ) {
    await database.run(
      `
            INSERT INTO user_settings (userId, refreshInterval, upperCaseDescription, paginationLimit)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(userId) DO UPDATE SET
                refreshInterval = excluded.refreshInterval,
                upperCaseDescription = excluded.upperCaseDescription,
                paginationLimit = excluded.paginationLimit
        `,
      [
        userId,
        settings.refreshInterval ?? 5000,
        settings.upperCaseDescription ? 1 : 0,
        settings.paginationLimit ?? 5,
      ]
    );
    return this.getSettings(userId);
  }
}
