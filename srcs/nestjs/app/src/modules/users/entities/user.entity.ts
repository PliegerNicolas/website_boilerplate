import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";
import { RegistrationMethod } from "../models/enums/registration-method.enum";
import { IsEnum } from "class-validator";
import { Exclude } from "class-transformer";

@Entity({ name: 'users' })
@TableInheritance({ column: { name: 'authProvider', type: "varchar" } })
export class User {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    //@Exclude()
    email: string;

    @Column({ unique: true })
    displayName: string;

    @Column()
    @IsEnum({ type: 'enum', enum: RegistrationMethod })
    registrationMethod: RegistrationMethod;

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
        return (this.registrationMethod === RegistrationMethod.LOCAL);
    }

    /* Helper methods */

}