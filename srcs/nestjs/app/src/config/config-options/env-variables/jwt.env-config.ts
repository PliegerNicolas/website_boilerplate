import { registerAs } from "@nestjs/config";
import { validateConfig } from "../env-validation/functions/validate.env-validation";
import { JwtConfigEnvValidation } from "../env-validation/jwt.env-validation";

export const jwtEnvConfig = registerAs('jwt', () => {
    const config = {
        accessTokenSecret: process.env.JWT_ACCESS_SECRET,
        refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
        accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
        refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
    };

    validateConfig(JwtConfigEnvValidation, config);

    return (config);
});