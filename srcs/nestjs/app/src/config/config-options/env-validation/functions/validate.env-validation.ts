import { ValidationError } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

export function validateConfig(validationClass: any, config: Record<string, unknown>) {
    const validateConfig: string = plainToInstance(validationClass, config, {
        enableImplicitConversion: true,
    });

    const errors: ValidationError[] = validateSync(validateConfig, {
        skipMissingProperties: false,
    });

    console.log(validateConfig);

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
}