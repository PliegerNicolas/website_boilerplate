import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { RegistrationMethod } from "../models/enums/registration-method.enum";
import { IsEnum } from "class-validator";

@Entity({ name: 'users' })
@TableInheritance({ column: { name: 'authProvider', type: "varchar" } })
export class User {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    displayName: string;

    @Column()
    @IsEnum({ type: 'enum', enum: RegistrationMethod })
    registrationMethod: RegistrationMethod;

    @Column({ nullable: true })
    password: string;



    @BeforeInsert()
    @BeforeUpdate()
    private verifications(): void {
        if (this.shouldPasswordExist() !== !!this.password) {
            throw new Error('Password is required for local registration method'); // Set exception instead maybe ?
        }
    }

    private shouldPasswordExist(): boolean {
        return (this.registrationMethod === RegistrationMethod.LOCAL);
    }

}