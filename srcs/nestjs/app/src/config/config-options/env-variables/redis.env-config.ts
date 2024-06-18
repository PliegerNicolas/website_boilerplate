import { registerAs } from "@nestjs/config";
import { validateConfig } from "../env-validation/functions/validate.env-validation";
import { RedisConfigEnvValidation } from "../env-validation/redis.env-validation";

export const redisEnvConfig = registerAs('redis', () => {
    const config = {
        host: 'redis',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : null,
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASSWORD,
    };

    validateConfig(RedisConfigEnvValidation, config);

    return (config);
});