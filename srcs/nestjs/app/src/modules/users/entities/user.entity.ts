import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ServerRole } from "../models/enums/role.enum";
import { RegistrationMethod } from "./registration-method.entity";

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column({ type: 'enum', enum: ServerRole, default: ServerRole.UNVERIFIED })
    serverRole: ServerRole;

    @OneToOne(() => RegistrationMethod, (registrationMethod) => registrationMethod.user, { cascade: true })
    @JoinColumn()
    registrationMethod: RegistrationMethod;
    
    @Exclude()
    @Column({ nullable: true, default: null })
    refreshToken: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    /* Relationships */

    /* Life cycle */

    /* Helper methods */

}