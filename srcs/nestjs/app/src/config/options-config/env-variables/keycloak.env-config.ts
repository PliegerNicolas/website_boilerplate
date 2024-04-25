import { registerAs } from "@nestjs/config";
import { validateConfig } from "../env-validation/functions/validate.env-validation";
import { KeycloakConfigEnvValidation } from "../env-validation/keycloak.env-validation";

export const keycloakEnvConfig = registerAs('keycloak', () => {
    const config = {
        host: 'keycloak',
        port: process.env.KEYCLOAK_PORT ? parseInt(process.env.KEYCLOAK_PORT, 10) : null,
    };

    validateConfig(KeycloakConfigEnvValidation, config);

    return (config);
});