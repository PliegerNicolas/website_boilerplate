import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { ValidateIfArgument } from "./types/validate-if-argument.type";

@ValidatorConstraint({ name: 'RequiredIfValidator', async: false })
export class RequiredIfValidator implements ValidatorConstraintInterface {

    validate(value: any, validationArguments?: ValidationArguments | undefined): boolean | Promise<boolean> {
        if (!validationArguments || !validationArguments.constraints) return (false);

        console.log(validationArguments);

        const object: any = validationArguments.object;
        const objectKeys: string[] = Object.keys(object);
        const args: ValidateIfArgument = validationArguments.constraints[0];

        if (!objectKeys.includes(args.key)) return (false);
        if (object[args.key] === args.expectedValue) return (!!value);

        return (!(!!value));
    }

    defaultMessage(validationArguments?: ValidationArguments | undefined): string {
        if (!validationArguments) {
            return ('ValidationArguments undefined. Validation should be executed inside a decorated class method');
        }
        if (!validationArguments.constraints) {
            return ('No validation constraints detected');
        }

        const property: string = validationArguments.property;
        const object: any = validationArguments.object;
        const objectKeys: string[] = Object.keys(object);
        const args: ValidateIfArgument = validationArguments.constraints[0];

        if (!objectKeys.includes(args.key)) {
            throw new Error(`${args.key} undefined in target object`);
        }

        if (object[args.key] === args.expectedValue) {
            return (`With '${args.key}: ${args.expectedValue}' set, a value is expected for ${property}`);
        } else {
            return (`With '${args.key}: ${args.expectedValue}' set, no value is expected for ${property}`);        
        }
    }
}