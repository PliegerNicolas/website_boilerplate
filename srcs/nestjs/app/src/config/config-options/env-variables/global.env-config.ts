import { registerAs } from "@nestjs/config";
import { validateConfig } from "../env-validation/functions/validate.env-validation";
import { GlobalConfigEnvValidation } from "../env-validation/global.env-validation";

export const globalEnvConfig = registerAs('global', () => {
    const config = {
        domain_name: process.env.DOMAIN_NAME,
        node_env: process.env.NODE_ENV || 'development',
    };

    validateConfig(GlobalConfigEnvValidation, config);

    return (config);
});