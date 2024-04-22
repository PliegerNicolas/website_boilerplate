import { registerAs } from "@nestjs/config";
import { validateConfig } from "../env-validation/functions/validate.env-validation";
import { FrontendConfigEnvValidation } from "../env-validation/frontend.env-validation";

export const frontendEnvConfig = registerAs('frontend', () => {
    const config = {
        host: 'vuejs',
        port: process.env.FRONTEND_PORT ? parseInt(process.env.FRONTEND_PORT, 10) : null,
    };

    validateConfig(FrontendConfigEnvValidation, config);

    return (config);
});