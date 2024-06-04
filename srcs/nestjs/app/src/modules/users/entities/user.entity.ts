import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";
import { RegistrationMethodEnum } from "../models/enums/registration-method.enum";
import { IsEnum } from "class-validator";
import { Exclude } from "class-transformer";
import { ServerRole } from "../models/enums/role.enum";

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column({ type: 'enum', enum: ServerRole, default: ServerRole.USER })
    serverRole: ServerRole;

    @Exclude()
    @Column()
    @IsEnum({ type: 'enum', enum: RegistrationMethodEnum })
    registrationMethod: RegistrationMethodEnum;

    @Exclude()
    @Column({ nullable: true })
    password: string;
    
    @Exclude()
    @Column({ nullable: true, default: null })
    refreshToken: string;

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