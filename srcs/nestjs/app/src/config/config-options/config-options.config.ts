import { ConfigModuleOptions } from "@nestjs/config";
import { backendEnvConfig } from "./env-variables/backend.env-config";
import { databaseEnvConfig } from "./env-variables/database.env-config";
import { frontendEnvConfig } from "./env-variables/frontend.env-config";
import { globalEnvConfig } from "./env-variables/global.env-config";
import { jwtEnvConfig } from "./env-variables/jwt.env-config";
import { redisEnvConfig } from "./env-variables/redis.env-config";
import { GoogleClientEnvConfig } from "./env-variables/google-client.env-config";

export const ConfigOptions: ConfigModuleOptions = {
    isGlobal: true,
    envFilePath: [
        './env/.env',
        `./env/.env.${process.env.NODE_ENV || 'development'}`,
    ],
    cache: true,
    ignoreEnvVars: false,
    expandVariables: true,
    load: [
        globalEnvConfig,
        frontendEnvConfig,
        backendEnvConfig,
        databaseEnvConfig,
        redisEnvConfig,
        jwtEnvConfig,
        GoogleClientEnvConfig,
    ],
};