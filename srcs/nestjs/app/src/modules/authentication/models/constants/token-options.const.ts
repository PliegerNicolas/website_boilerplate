import { ConfigService } from "@nestjs/config";

export const refreshTokenOptions: any = (configService: ConfigService) => ({
    secret: configService.getOrThrow('jwt.refreshTokenSecret'),
    expiresIn: configService.getOrThrow('jwt.refreshTokenExpiration'),
});

export const accessTokenOptions: any = (configService: ConfigService) => ({
    secret: configService.getOrThrow('jwt.accessTokenSecret'),
    expiresIn: configService.getOrThrow('jwt.accessTokenExpiration'),
});