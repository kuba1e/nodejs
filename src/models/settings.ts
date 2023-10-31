import { AppDataSource } from "../data-source";
import { Settings } from "../entity";

export const SettingsRepository = AppDataSource.getRepository(Settings);
