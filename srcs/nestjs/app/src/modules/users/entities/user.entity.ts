import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";
import { RegistrationMethodEnum } from "../models/enums/registration-method.enum";
import { IsEnum } from "class-validator";
import { Exclude } from "class-transformer";

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Exclude()
    @Column()
    @IsEnum({ type: 'enum', enum: RegistrationMethodEnum })
    registrationMethod: RegistrationMethodEnum;

    @Column({ nullable: true })
    @Exclude()
    password: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    /* Relationships */

    /* Life cycle */

    @BeforeInsert()
    @BeforeUpdate()
    private verifications(): void {
        if (this.shouldPasswordExist() !== !!this.password) {
            throw new Error('Password is required for local registration method'); // Set exception instead maybe ?
        }
    }

    private shouldPasswordExist(): boolean {
        return (this.registrationMethod === RegistrationMethodEnum.LOCAL);
    }

    /* Helper methods */

}