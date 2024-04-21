import { ConfigFactory, ConfigModuleOptions } from "@nestjs/config";
import * as Joi from "joi";

// Defining the structure that holds the environment
// variables.
const configVariables: ConfigFactory = async () => {
    return ({
        global: {
            domain_name: process.env.DOMAIN_NAME,
        },
        frontend: {
            host: 'vuejs',
            port: parseInt(process.env.FRONTEND_PORT ?? '3000'),
        },
        backend: {
            host: 'nestjs',
            port: parseInt(process.env.PORT ?? '3000'),
        },
        database: {
            host: 'postgres',
            port: parseInt(process.env.DB_PORT ?? '5432'),
            db: process.env.POSTGRES_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
        },
        jwt: {
            jwtSecret: process.env.JWT_SECRET,
            jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
            accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
            refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
        },
    });
};

// Use Joi to validate presence of
// environment variables and type.
const ValidationSchema = Joi.object({
    global: Joi.object({
        domain_name: Joi.string().required(),
    }),
    frontend: Joi.object({
        host: Joi.string().required(),
        port: Joi.number().required(),
    }),
    backendend: Joi.object({
        host: Joi.string().required(),
        port: Joi.number().required(),
    }),
    database: Joi.object({
        host: Joi.string().required(),
        port: Joi.number().required(),
        name: Joi.string().required(),
        user: Joi.string().required(),
        password: Joi.string().required(),
    }),
    jwt: Joi.object({
        jwtSecret: Joi.string().required(),
        jwtRefreshSecret: Joi.string().required(),
        accessTokenExpiration: Joi.number().required(),
        refreshTokenExpiration: Joi.number().required(),
    }),
});

// Configuration for ConfigModule.
export const ConfigOptions: ConfigModuleOptions = {
    envFilePath: `/env/.env.${process.env.NODE_ENV || '.development'}`,
    isGlobal: true,
    cache: true,
    ignoreEnvVars: false,
    expandVariables: true,
    validationOptions: { abortEarly: true },
    validationSchema: ValidationSchema,
    load: [configVariables],
};