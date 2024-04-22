import { registerAs } from "@nestjs/config";
import { validateConfig } from "../env-validation/functions/validate.env-validation";
import { DatabaseConfigEnvValidation } from "../env-validation/database.env-validation";

export const databaseEnvConfig = registerAs('database', () => {
    const config = {
        host: 'postgres',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : null,
        db: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
    };

    validateConfig(DatabaseConfigEnvValidation, config);

    return (config);
});