import { ValidationOptions, registerDecorator } from "class-validator";
import { RequiredIfValidator } from "./required-if.validator";
import { ValidateIfArgument } from "./types/validate-if-argument.type";

export function RequiredIf(validateIfArgument: ValidateIfArgument, validationOptions?: ValidationOptions) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            name: 'requiredIf',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [validateIfArgument],
            options: validationOptions,
            validator: RequiredIfValidator,
            async: false,
        });
    };
}