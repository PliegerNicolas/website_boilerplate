import { registerAs } from "@nestjs/config";
import { validateConfig } from "../env-validation/functions/validate.env-validation";
import { GoogleClientConfigEnvValidation } from "../env-validation/google-client.env-validation";

export const GoogleClientEnvConfig = registerAs('googleClient', () => {
    const config = {
        id: process.env.GOOGLE_OAUTH2_ID,
        secret: process.env.GOOGLE_OAUTH2_SECRET,
        callbackURL: process.env.GOOGLE_OAUTH2_CALLBACK_URL,
    };

    validateConfig(GoogleClientConfigEnvValidation, config);

    return (config);
});