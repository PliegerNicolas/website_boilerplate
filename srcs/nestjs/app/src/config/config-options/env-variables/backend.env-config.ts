import { registerAs } from "@nestjs/config";
import { validateConfig } from "../env-validation/functions/validate.env-validation";
import { BackendConfigEnvValidation } from "../env-validation/backend.env-validation";

export const backendEnvConfig = registerAs('backend', () => {
    const config = {
        host: 'nestjs',
        port: process.env.PORT ? parseInt(process.env.PORT, 10) : null,
    };

    validateConfig(BackendConfigEnvValidation, config);

    return (config);
});