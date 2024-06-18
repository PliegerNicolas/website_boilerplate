import { registerAs } from "@nestjs/config";
import { validateConfig } from "../env-validation/functions/validate.env-validation";
import { DatabasesConfigEnvValidation } from "../env-validation/database.env-validation";

export const databaseEnvConfig = registerAs('database', () => {
    const config = {
        for_nestjs: {
            host: 'postgres_nestjs',
            port: process.env.DB_NESTJS_PORT ? parseInt(process.env.DB_NESTJS_PORT, 10) : null,
            db: process.env.POSTGRES_NESTJS_DB,
            user: process.env.POSTGRES_NESTJS_USER,
            password: process.env.POSTGRES_NESTJS_PASSWORD,
        }
    };

    validateConfig(DatabasesConfigEnvValidation, config);

    return (config);
});